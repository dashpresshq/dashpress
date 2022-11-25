import {
  FilterOperators,
  IColumnFilterBag,
  DATE_FILTER_VALUE,
} from "@hadmean/protozoa";
import { Knex } from "knex";
import get from "lodash/get";
import { getDbConnection } from "backend/lib/connection/db";
import { QueryFilter } from "shared/types/data";
import { IApplicationService } from "backend/types";
import { credentialsService } from "backend/integrations-configurations";
import { IDataSourceCredentials } from "shared/types/data-sources";
import { progammingError } from "backend/lib/errors";
import { IPaginationFilters } from "./types";
import { DATABASE_CREDENTIAL_GROUP } from "./fields";
import { CONSTANT_TIME_MAP, RELATIVE_TIME_MAP } from "./time.constants";

export class DataService implements IApplicationService {
  static _dbInstance: Knex | null = null;

  static async getInstance() {
    if (this._dbInstance) {
      return this._dbInstance;
    }

    const dbCredentials =
      await credentialsService.useGroupValue<IDataSourceCredentials>(
        DATABASE_CREDENTIAL_GROUP
      );

    this._dbInstance = (await getDbConnection(
      dbCredentials
    )) as unknown as Knex;

    return this._dbInstance;
  }

  async bootstrap() {
    await DataService.getInstance();
  }

  static dateFilterToTime(value: string) {
    if (value && new Date(value).toString() !== "Invalid Date") {
      return new Date(value);
    }

    const constantTimeImplementation = CONSTANT_TIME_MAP[value];

    if (constantTimeImplementation) {
      return constantTimeImplementation();
    }

    const [countString, field] = value.split(":");
    const count = +countString;

    const relativeTimeImplementation = RELATIVE_TIME_MAP[field];

    if (relativeTimeImplementation) {
      return relativeTimeImplementation(count);
    }

    return new Date();
  }

  static filterOperatorToQuery(
    query: Knex.QueryBuilder,
    column: string,
    { operator, value, value2 }: IColumnFilterBag<unknown>
  ) {
    if (!operator || !value || !column) {
      return query;
    }
    switch (operator) {
      case FilterOperators.EQUAL_TO:
        return query.where(column, "=", value);

      case FilterOperators.LESS_THAN:
        return query.where(column, "<", value);

      case FilterOperators.GREATER_THAN:
        return query.where(column, ">", value);

      case FilterOperators.CONTAINS:
        return query.whereILike(column, `%${value}%`);

      case FilterOperators.IN:
        return query.whereIn(column, value as string[]);

      case FilterOperators.NOT_EQUAL:
        return query.whereNot(column, "=", value);

      case FilterOperators.BETWEEN:
        if (!value2) {
          return query;
        }
        return query.whereBetween(column, [value, value2]);

      case FilterOperators.DATE: {
        const firstTime = DataService.dateFilterToTime(
          (value as string) || DATE_FILTER_VALUE.BEGINNING_OF_TIME_VALUE
        );
        const secondTime = DataService.dateFilterToTime(
          (value2 as string) || DATE_FILTER_VALUE.NOW
        );
        const timeBetween: [Date, Date] =
          firstTime.getTime() < secondTime.getTime()
            ? [firstTime, secondTime]
            : [secondTime, firstTime];

        return query.whereBetween(column, timeBetween);
      }
      case FilterOperators.NOT_IN:
        return query.whereNotIn(column, value as string[]);
    }
  }

  static transformQueryFiltersQueryBuilder = (
    query: Knex.QueryBuilder,
    queryFilter: QueryFilter[]
  ): Knex.QueryBuilder => {
    queryFilter.forEach((filter) => {
      // eslint-disable-next-line no-param-reassign
      query = DataService.filterOperatorToQuery(query, filter.id, filter.value);
    });
    return query;
  };

  async count(entity: string, queryFilter: QueryFilter[]): Promise<number> {
    let query = (await DataService.getInstance()).from(entity);

    query = DataService.transformQueryFiltersQueryBuilder(query, queryFilter);

    return +get(await query.count({ count: "*" }), [0, "count"], 0);
  }

  async list(
    entity: string,
    select: string[],
    queryFilter: QueryFilter[],
    dataFetchingModifiers: IPaginationFilters
  ) {
    let query = DataService.transformQueryFiltersQueryBuilder(
      (await DataService.getInstance()).select(select).from(entity),
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

  async show<T>(
    entity: string,
    select: string[],
    query: Record<string, unknown>
  ): Promise<T> {
    progammingError(
      "We dont do that here, Please define the fields you want to select",
      select.length === 0
    );

    return await (await DataService.getInstance())
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
      await DataService.getInstance()
    )(entity).insert(data, primaryField);
    return result[0][primaryField];
  }

  async update(
    entity: string,
    query: Record<string, unknown>,
    data: Record<string, unknown>
  ): Promise<void> {
    await (await DataService.getInstance())(entity).where(query).update(data);
  }

  async delete(entity: string, query: Record<string, unknown>): Promise<void> {
    await (await DataService.getInstance())(entity).where(query).del();
  }
}

export const dataService = new DataService();
