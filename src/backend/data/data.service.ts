import {
  FilterOperators,
  IColumnFilterBag,
  DATE_FILTER_VALUE,
} from "@hadmean/protozoa";
import { Knex } from "knex";
import get from "lodash/get";
import { credentialsService } from "backend/credentials/credentials.service";
import { getDbConnection } from "backend/lib/connection/db";
import { CREDENTIALS_DOMAINS } from "backend/credentials/crendential.types";
import { IDataSourceCredentials, QueryFilter } from "shared/types";
import { IApplicationService } from "backend/types";
import {
  subDays,
  subHours,
  subMonths,
  subQuarters,
  subYears,
  subWeeks,
} from "date-fns";
import { IPaginationFilters } from "./types";

export class DataService implements IApplicationService {
  static _dbInstance: Knex | null = null;

  static async getInstance() {
    if (this._dbInstance) {
      return this._dbInstance;
    }

    const dbCredentials: IDataSourceCredentials =
      await credentialsService.getDomainCredentials<IDataSourceCredentials>(
        CREDENTIALS_DOMAINS.database
      );

    this._dbInstance = await getDbConnection(dbCredentials);

    return this._dbInstance;
  }

  async bootstrap() {
    await DataService.getInstance();
  }

  private dateFilterToTime(value: string) {
    if (value && new Date(value).toString() !== "Invalid Date") {
      return new Date(value);
    }
    if (value === DATE_FILTER_VALUE.BEGINNING_OF_TIME_VALUE) {
      return new Date(0, 0, 0);
    }
    if (value === DATE_FILTER_VALUE.NOW) {
      return new Date();
    }
    if (value === DATE_FILTER_VALUE.BEGINNING_OF_YEAR) {
      return new Date(new Date().getFullYear(), 0, 0);
    }
    const [countString, field] = value.split(":");
    const count = +countString;

    if (field === DATE_FILTER_VALUE.HOUR) {
      return subHours(new Date(), count);
    }
    if (field === DATE_FILTER_VALUE.DAY) {
      return subDays(new Date(), count);
    }
    if (field === DATE_FILTER_VALUE.WEEK) {
      return subWeeks(new Date(), count);
    }
    if (field === DATE_FILTER_VALUE.MONTH) {
      return subMonths(new Date(), count);
    }
    if (field === DATE_FILTER_VALUE.QUARTER) {
      return subQuarters(new Date(), count);
    }
    if (field === DATE_FILTER_VALUE.YEAR) {
      return subYears(new Date(), count);
    }
    return new Date();
  }

  private filterOperatorToQuery(
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
        const firstTime = this.dateFilterToTime(
          (value as string) || DATE_FILTER_VALUE.BEGINNING_OF_TIME_VALUE
        );
        const secondTime = this.dateFilterToTime(
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
    let query = (await DataService.getInstance()).from(entity);

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
    if (select.length === 0) {
      throw new Error(
        "We dont do that here, Please define the fields you want to select"
      );
    }
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
