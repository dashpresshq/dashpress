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
    queryModifiers: {
      take: number;
      page: number;
      orderBy: string;
      sortBy: string;
    }
  ) {
    let query = DataService.getInstance().select().from(model);
    if (queryModifiers.page && queryModifiers.take) {
      query = query
        .limit(Number(queryModifiers.take))
        .offset(
          (Number(queryModifiers.page) - 1) * Number(queryModifiers.take)
        );
    }

    if (queryModifiers.orderBy && queryModifiers.sortBy) {
      //TODO validate sortBy
      query = query.orderBy(
        queryModifiers.sortBy,
        queryModifiers.orderBy.toLowerCase() === "desc" ? "desc" : "asc"
      );
    }

    return await query;
  }

  show() {}

  update() {}

  delete() {}
}

export const dataService = new DataService();
