import { FilterOperators } from "@gothicgeeks/design-system"; // Move this somewhere else
import { IColumnFilterBag } from "@gothicgeeks/design-system/dist/components/Table/filters/types";
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
    let query = DataService.getInstance().from(entity);

    query = this.transformQueryFiltersQueryBuilder(query, queryFilter);

    return get(await query.count(), [0, "count"], 0);
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
    let query = this.transformQueryFiltersQueryBuilder(
      DataService.getInstance().select(select).from(entity),
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
