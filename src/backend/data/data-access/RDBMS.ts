/* eslint-disable no-param-reassign */
import { credentialsApiService } from "backend/integrations-configurations";
import { getDbConnection } from "backend/lib/connection/db";
import type { Knex } from "knex";
import type { FieldQueryFilter, QueryFilterSchema } from "shared/types/data";
import { FilterOperators } from "shared/types/data";
import type { IDataSourceCredentials } from "shared/types/data-sources";
import { DATA_SOURCES_CONFIG } from "shared/types/data-sources";

import { DATABASE_CREDENTIAL_GROUP } from "../fields";
import type { IPaginationFilters } from "../types";
import { BaseDataAccessService } from "./_Base";
import type { QueryOperationImplementation } from "./types";
import { QueryOperators } from "./types";

const makeArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "string") {
    return value.split(",");
  }
  return [];
};

export class RDBMSDataApiService extends BaseDataAccessService<Knex.QueryBuilder> {
  queryOperationImplementation: QueryOperationImplementation<Knex.QueryBuilder> =
    {
      and: {
        [QueryOperators.IS_NULL]: (query, column) => query.whereNull(column),
        [QueryOperators.IS_NOT_NULL]: (query, column) =>
          query.whereNotNull(column),
        [QueryOperators.EQUAL_TO]: (query, column, value) =>
          query.where(column, "=", value),
        [QueryOperators.LESS_THAN]: (query, column, value) =>
          query.where(column, "<", value),
        [QueryOperators.GREATER_THAN]: (query, column, value) =>
          query.where(column, ">", value),
        [QueryOperators.CONTAINS]: (query, column, value) =>
          query.whereILike(column, `%${value}%`),
        [QueryOperators.IN]: (query, column, value) =>
          query.whereIn(column, makeArray(value)),
        [QueryOperators.NOT_IN]: (query, column, value) =>
          query.whereNotIn(column, makeArray(value)),
        [QueryOperators.NOT_EQUAL]: (query, column, value) =>
          query.whereNot(column, "=", value),
        [QueryOperators.BETWEEN]: (query, column, value) =>
          query.whereBetween(column, value as [string, string]),
      },
      or: {
        [QueryOperators.IS_NULL]: (query, column) => query.orWhereNull(column),
        [QueryOperators.IS_NOT_NULL]: (query, column) =>
          query.orWhereNotNull(column),
        [QueryOperators.EQUAL_TO]: (query, column, value) =>
          query.orWhere(column, "=", value),
        [QueryOperators.LESS_THAN]: (query, column, value) =>
          query.orWhere(column, "<", value),
        [QueryOperators.GREATER_THAN]: (query, column, value) =>
          query.orWhere(column, ">", value),
        [QueryOperators.CONTAINS]: (query, column, value) =>
          query.orWhereILike(column, `%${value}%`),
        [QueryOperators.IN]: (query, column, value) =>
          query.orWhereIn(column, makeArray(value)),
        [QueryOperators.NOT_IN]: (query, column, value) =>
          query.orWhereNotIn(column, makeArray(value)),
        [QueryOperators.NOT_EQUAL]: (query, column, value) =>
          query.orWhereNot(column, "=", value),
        [QueryOperators.BETWEEN]: (query, column, value) =>
          query.orWhereBetween(column, value as [string, string]),
      },
    };

  static _dbInstance: Knex | null = null;

  static _dbCredentials: IDataSourceCredentials | null = null;

  static async getInstance() {
    if (this._dbInstance) {
      return this._dbInstance;
    }

    const dbCredentials =
      await credentialsApiService.useGroupValue<IDataSourceCredentials>(
        DATABASE_CREDENTIAL_GROUP
      );

    this._dbCredentials = dbCredentials;

    this._dbInstance = await getDbConnection(dbCredentials);

    return this._dbInstance;
  }

  static async getDbCredentials() {
    if (!this._dbCredentials) {
      await this.getInstance();
    }
    return this._dbCredentials;
  }

  async bootstrap() {
    await RDBMSDataApiService.getInstance();
  }

  transformQueryFilterSchema = (
    query: Knex.QueryBuilder,
    queryFilter: QueryFilterSchema
  ): Knex.QueryBuilder => {
    queryFilter.children.forEach((filter) => {
      if ("id" in filter) {
        query = this.transformQueryFiltersQueryBuilder(
          query,
          filter,
          queryFilter.operator
        );
      } else {
        const builderQuery = (builder: Knex.QueryBuilder) => {
          return this.transformQueryFilterSchema(builder, filter);
        };

        query =
          queryFilter.operator === "and"
            ? query.where(builderQuery)
            : query.orWhere(builderQuery);

        if (queryFilter.modifyQuery) {
          query = queryFilter.modifyQuery(query);
        }
      }
    });
    return query;
  };

  private transformQueryFiltersQueryBuilder = (
    query: Knex.QueryBuilder,
    queryFilter: FieldQueryFilter,
    operator: "and" | "or"
  ): Knex.QueryBuilder => {
    return this.filterOperatorToQuery(
      query,
      queryFilter.id,
      queryFilter.value,
      operator
    );
  };

  async count(entity: string, queryFilter: QueryFilterSchema): Promise<number> {
    let query = (await RDBMSDataApiService.getInstance()).from(entity);

    query = this.transformQueryFilterSchema(query, queryFilter);

    return +(await query.count({ count: "*" }))[0].count || 0;
  }

  async list(
    entity: string,
    select: string[],
    queryFilter: QueryFilterSchema,
    dataFetchingModifiers: IPaginationFilters
  ) {
    let query = this.transformQueryFilterSchema(
      (await RDBMSDataApiService.getInstance()).select(select).from(entity),
      queryFilter
    );

    if (dataFetchingModifiers.page && dataFetchingModifiers.take) {
      query = query
        .limit(Number(dataFetchingModifiers.take))
        .offset(
          (Number(dataFetchingModifiers.page) - 1) *
            Number(dataFetchingModifiers.take)
        );
    }

    if (dataFetchingModifiers.orderBy && dataFetchingModifiers.sortBy) {
      query = query.orderBy(
        dataFetchingModifiers.sortBy,
        dataFetchingModifiers.orderBy
      );
    }

    return await query;
  }

  async read<T>(
    entity: string,
    select: string[],
    queryFilter: QueryFilterSchema
  ): Promise<T> {
    const query = this.transformQueryFilterSchema(
      (await RDBMSDataApiService.getInstance()).table(entity).select(select),
      queryFilter
    );

    return await query.first();
  }

  async create(
    entity: string,
    data: Record<string, unknown>,
    primaryField: string
  ): Promise<string | number> {
    const result = await (
      await RDBMSDataApiService.getInstance()
    )(entity).insert(data, primaryField);
    return result[0][primaryField];
  }

  async update(
    entity: string,
    queryFilter: QueryFilterSchema,
    data: Record<string, unknown>
  ): Promise<void> {
    await this.transformQueryFilterSchema(
      (
        await RDBMSDataApiService.getInstance()
      )(entity),
      queryFilter
    ).update(data);
  }

  async delete(entity: string, queryFilter: QueryFilterSchema): Promise<void> {
    await this.transformQueryFilterSchema(
      (
        await RDBMSDataApiService.getInstance()
      )(entity),
      queryFilter
    ).del();
  }

  async runQuery(sql: string) {
    const driverResponse = await (
      await RDBMSDataApiService.getInstance()
    ).raw(sql);

    const dbCredentials = await RDBMSDataApiService.getDbCredentials();

    return DATA_SOURCES_CONFIG[dbCredentials.dataSourceType].getQueryData(
      driverResponse
    );
  }

  whereEqualQueryFilterSchema(
    column: string,
    value: string
  ): QueryFilterSchema {
    return {
      operator: "and",
      children: [
        {
          id: column,
          value: {
            operator: FilterOperators.EQUAL_TO,
            value,
          },
        },
      ],
    };
  }
}

export const rDBMSDataApiService = new RDBMSDataApiService();
