import knex, { Knex } from "knex";
import get from "lodash/get";
export class DataService {
  static _dbInstance: Knex = null;

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

    return this._dbInstance;
  }

  private afterConnection() {}

  async count(entity: string): Promise<number> {
    return get(
      await DataService.getInstance().count().from(entity),
      [0, "count"],
      0
    );
  }

  async list(
    entity: string,
    dataFetchingModifiers: {
      take: number;
      page: number;
      orderBy: string;
      sortBy: string;
    }
  ) {
    // Select
    let query = DataService.getInstance().select().from(entity);
    if (dataFetchingModifiers.page && dataFetchingModifiers.take) {
      query = query
        .limit(Number(dataFetchingModifiers.take))
        .offset(
          (Number(dataFetchingModifiers.page) - 1) *
            Number(dataFetchingModifiers.take)
        );
    }

    if (dataFetchingModifiers.orderBy && dataFetchingModifiers.sortBy) {
      //TODO validate sortBy
      query = query.orderBy(
        dataFetchingModifiers.sortBy,
        dataFetchingModifiers.orderBy
      );
    }

    return await query;
  }

  async show<T>(entity: string, query: Record<string, unknown>): Promise<T> {
    return await DataService.getInstance().table(entity).where(query).first();
  }

  async create(
    entity: string,
    data: Record<string, unknown>
  ) {
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
