import knex, { Knex } from "knex";
import get from 'lodash/get';
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

  private afterConnection(){

  }

  async count(model: string): Promise<number> {
    return get((await DataService.getInstance().count().from(model)), [0, 'count'], 0);
  }

  create() {}

  async list(model: string) {
    return await DataService.getInstance().select().from(model);
  }

  show() {}

  update() {}
}

export const dataService = new DataService();
