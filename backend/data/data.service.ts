import {
  FilterOperators,
  IColumnFilterBag,
} from "@gothicgeeks/design-system/dist/components/Table/filters/types";
import knex, { Knex } from "knex";
import get from "lodash/get";
import noop from "lodash/noop";

export type QueryFilter = { id: string; value: IColumnFilterBag<unknown> };

export class DataService {
  static _dbInstance: Knex | null = null;

  static getInstance() {
    if (!this._dbInstance) {
      this._dbInstance = knex({
        client: "pg",
        connection: {
          database: "kademiks",
          user: "postgres",
          password: "password",
        },
        searchPath: ["public"],
      });
    }
    this.afterConnection();
    return this._dbInstance;
  }

  static async afterConnection() {
    noop();
  }

  private transformQueryFiltersQueryBuilder = (
    query$: Knex.QueryBuilder,
    queryFilter: QueryFilter[]
  ): Knex.QueryBuilder => {
    let query = { ...query$ };
    queryFilter.forEach((filter) => {
      switch (filter.value.operator) {
        case FilterOperators.EQUAL_TO:
          query = query.where(filter.id, "=", filter.value.value);
          break;
        case FilterOperators.LESS_THAN:
          query = query.where(filter.id, "<", filter.value.value);
          break;
      }
    });
    return query;
  };

  async count(entity: string, queryFilter: QueryFilter[]): Promise<number> {
    const query = DataService.getInstance().count().from(entity);
    // query = this.transformQueryFiltersQueryBuilder(query, queryFilter);
    return get(await query, [0, "count"], 0);
  }

  async list(
    entity: string,
    select: string[],
    queryFilter: QueryFilter[],
    dataFetchingModifiers: {
      take: number;
      page: number;
      orderBy: string;
      sortBy: string;
    }
  ) {
    let query = DataService.getInstance().select(select).from(entity);

    // query = this.transformQueryFiltersQueryBuilder(query, queryFilter);

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

    // eslint-disable-next-line no-console
    console.log(query.toSQL());

    return await query;
  }

  async show<T>(
    entity: string,
    select: string[],
    query: Record<string, unknown>
  ): Promise<T> {
    return await DataService.getInstance()
      .table(entity)
      .select(select)
      .where(query)
      .first();
  }

  async create(entity: string, data: Record<string, unknown>) {
    await DataService.getInstance()(entity).insert(data);
  }

  async update(
    entity: string,
    query: Record<string, unknown>,
    data: Record<string, unknown>
  ): Promise<void> {
    await DataService.getInstance()(entity).where(query).update(data);
  }

  async delete(entity: string, query: Record<string, unknown>): Promise<void> {
    await DataService.getInstance()(entity).where(query).del();
  }
}

export const dataService = new DataService();
