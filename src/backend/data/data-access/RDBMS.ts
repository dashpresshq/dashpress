import { Knex } from "knex";
import get from "lodash/get";
import { getDbConnection } from "backend/lib/connection/db";
import { QueryFilter } from "shared/types/data";
import { credentialsApiService } from "backend/integrations-configurations";
import { IDataSourceCredentials } from "shared/types/data-sources";
import { BaseDataAccessService } from "./_Base";
import { DATABASE_CREDENTIAL_GROUP } from "../fields";
import { IPaginationFilters } from "../types";
import { QueryOperationImplementation, QueryOperators } from "./types";

export class RDBMSDataApiService extends BaseDataAccessService<Knex.QueryBuilder> {
  queryOperationImplementation: QueryOperationImplementation<Knex.QueryBuilder> =
    {
      [QueryOperators.EQUAL_TO]: (query, column, value) =>
        query.where(column, "=", value),
      [QueryOperators.LESS_THAN]: (query, column, value) =>
        query.where(column, "<", value),
      [QueryOperators.GREATER_THAN]: (query, column, value) =>
        query.where(column, ">", value),
      [QueryOperators.CONTAINS]: (query, column, value) =>
        query.whereILike(column, `%${value}%`),
      [QueryOperators.IN]: (query, column, value) =>
        query.whereIn(column, value as string[]),
      [QueryOperators.NOT_IN]: (query, column, value) =>
        query.whereNotIn(column, value as string[]),
      [QueryOperators.NOT_EQUAL]: (query, column, value) =>
        query.whereNot(column, "=", value),
      [QueryOperators.BETWEEN]: (query, column, value) =>
        query.whereBetween(column, value as [string, string]),
    };

  static _dbInstance: Knex | null = null;

  static async getInstance() {
    if (this._dbInstance) {
      return this._dbInstance;
    }

    const dbCredentials =
      await credentialsApiService.useGroupValue<IDataSourceCredentials>(
        DATABASE_CREDENTIAL_GROUP
      );

    this._dbInstance = await getDbConnection(dbCredentials);

    return this._dbInstance;
  }

  async bootstrap() {
    await RDBMSDataApiService.getInstance();
  }

  private transformQueryFiltersQueryBuilder = (
    query: Knex.QueryBuilder,
    queryFilter: QueryFilter[]
  ): Knex.QueryBuilder => {
    queryFilter.forEach((filter) => {
      // eslint-disable-next-line no-param-reassign
      query = this.filterOperatorToQuery(query, filter.id, filter.value);
    });
    return query;
  };

  async count(entity: string, queryFilter: QueryFilter[]): Promise<number> {
    let query = (await RDBMSDataApiService.getInstance()).from(entity);

    query = this.transformQueryFiltersQueryBuilder(query, queryFilter);

    return +get(await query.count({ count: "*" }), [0, "count"], 0);
  }

  async list(
    entity: string,
    select: string[],
    queryFilter: QueryFilter[],
    dataFetchingModifiers: IPaginationFilters
  ) {
    let query = this.transformQueryFiltersQueryBuilder(
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
    query: Record<string, unknown>
  ): Promise<T> {
    return await (await RDBMSDataApiService.getInstance())
      .table(entity)
      .select(select)
      .where(query)
      .first();
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
    query: Record<string, unknown>,
    data: Record<string, unknown>
  ): Promise<void> {
    await (await RDBMSDataApiService.getInstance())(entity)
      .where(query)
      .update(data);
  }

  async delete(entity: string, query: Record<string, unknown>): Promise<void> {
    await (await RDBMSDataApiService.getInstance())(entity).where(query).del();
  }
}

export const rDBMSDataApiService = new RDBMSDataApiService();
