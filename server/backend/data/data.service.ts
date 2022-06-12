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

  async count(model: string): Promise<number> {
    return get(
      await DataService.getInstance().count().from(model),
      [0, "count"],
      0
    );
  }

  create() {}

  async list(
    model: string,
    dataFetchingModifiers: {
      take: number;
      page: number;
      orderBy: string;
      sortBy: string;
    }
  ) {
    let query = DataService.getInstance().select().from(model);
    if (dataFetchingModifiers.page && dataFetchingModifiers.take) {
      query = query
        .limit(Number(dataFetchingModifiers.take))
        .offset(
          (Number(dataFetchingModifiers.page) - 1) * Number(dataFetchingModifiers.take)
        );
    }

    if (dataFetchingModifiers.orderBy && dataFetchingModifiers.sortBy) {
      //TODO validate sortBy
      query = query.orderBy(
        dataFetchingModifiers.sortBy,
        dataFetchingModifiers.orderBy.toLowerCase() === "desc" ? "desc" : "asc"
      );
    }

    return await query;
  }

  show() {}

  update() {}

  delete() {}
}

export const dataService = new DataService();
