import { Knex } from "knex";
import noop from "lodash/noop";
import {
  ConfigKeys,
  configService,
  ConfigService,
} from "../config/config.service";
import { getKnexConnection } from "../connection/db";
import { AbstractConfigDataPersistenceService } from "./AbstractConfigDataPersistenceService";
import { ConfigDomain } from "./types";

// TODO implement
export class DatabaseConfigDataPersistenceAdaptor<
  T
> extends AbstractConfigDataPersistenceService<T> {
  static _dbInstance: Knex | null = null;

  static async getDbInstance() {
    if (this._dbInstance) {
      return this._dbInstance;
    }
    this._dbInstance = await getKnexConnection(
      configService.getConfigValue(ConfigKeys.CONFIG_ADAPTOR_CONNECTION_STRING)
    );
    return this._dbInstance;
  }

  constructor(configDomain: ConfigDomain, _configService: ConfigService) {
    super(configDomain, _configService);
  }

  async resetToEmpty() {
    noop("TODO");
  }

  async getAllItems() {
    return (await this.getDomainQueryBuilder()).select(["data"]);
  }

  async getItem(key: string) {
    return (await this.getDomainQueryBuilder())
      .where({ key })
      .select(["data"])
      .first();
  }

  async upsertItem(key: string, data: T) {
    (await this.getDomainQueryBuilder()).where({ key }).update({ data });
  }

  async removeItem(key: string): Promise<void> {
    (await this.getDomainQueryBuilder()).where({ key }).del();
  }

  async saveAllItems(keyField: keyof T, data: T[]) {
    Object.fromEntries(data.map((datum) => [datum[keyField], datum]));
  }

  private async getDomainQueryBuilder(): Promise<Knex.QueryBuilder<any>> {
    return (await DatabaseConfigDataPersistenceAdaptor.getDbInstance()).from(
      this.configDomain
    );
  }
}

// TODO cacheService should be employed here
