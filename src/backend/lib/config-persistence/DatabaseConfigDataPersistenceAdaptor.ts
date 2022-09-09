import { Knex } from "knex";
import {
  ConfigKeys,
  configService,
  ConfigService,
} from "../config/config.service";
import { getDbConnection } from "../connection/db";
import { AbstractConfigDataPersistenceService } from "./AbstractConfigDataPersistenceService";
import { ConfigDomain } from "./types";

const CONFIG_TABLE_PREFIX = (domain: string) => `hadmean__${domain}`;

export class DatabaseConfigDataPersistenceAdaptor<
  T
> extends AbstractConfigDataPersistenceService<T> {
  static _dbInstance: Record<string, Knex | null> = {};

  static async getDbInstance(configDomain: ConfigDomain): Promise<Knex> {
    if (this._dbInstance[configDomain]) {
      return this._dbInstance[configDomain];
    }

    this._dbInstance[configDomain] = await getDbConnection(
      configService.getConfigValue(ConfigKeys.CONFIG_ADAPTOR_CONNECTION_STRING)
    );

    if (
      !(await this._dbInstance[configDomain].schema.hasTable(
        CONFIG_TABLE_PREFIX(configDomain)
      ))
    ) {
      await this._dbInstance[configDomain].schema.createTableIfNotExists(
        CONFIG_TABLE_PREFIX(configDomain),
        (table) => {
          table.increments("id");
          table.string("key").notNullable().unique();
          table.text("value");
        }
      );
    }

    return this._dbInstance[configDomain];
  }

  constructor(configDomain: ConfigDomain, _configService: ConfigService) {
    super(configDomain, _configService);
  }

  async setup() {
    await DatabaseConfigDataPersistenceAdaptor.getDbInstance(this.configDomain);
  }

  async resetToEmpty() {
    await (
      await DatabaseConfigDataPersistenceAdaptor.getDbInstance(
        this.configDomain
      )
    )(CONFIG_TABLE_PREFIX(this.configDomain)).del();
  }

  async getAllItems() {
    const query = (
      await DatabaseConfigDataPersistenceAdaptor.getDbInstance(
        this.configDomain
      )
    )
      .select(["value", "key"])
      .from(CONFIG_TABLE_PREFIX(this.configDomain));

    const items = await query;

    return items.map(({ value }) => JSON.parse(value));
  }

  async getItem(key: string) {
    const connection = await DatabaseConfigDataPersistenceAdaptor.getDbInstance(
      this.configDomain
    );
    const queryResponse = await connection
      .table(CONFIG_TABLE_PREFIX(this.configDomain))
      .select(["value"])
      .where({ key })
      .first();

    if (!queryResponse) {
      return queryResponse;
    }

    return JSON.parse(queryResponse.value);
  }

  async upsertItem(key: string, value: T) {
    const affectedRowsCount = await (
      await DatabaseConfigDataPersistenceAdaptor.getDbInstance(
        this.configDomain
      )
    )(CONFIG_TABLE_PREFIX(this.configDomain))
      .where({ key })
      .update({
        value: JSON.stringify(value),
      });
    if (affectedRowsCount === 0) {
      await (
        await DatabaseConfigDataPersistenceAdaptor.getDbInstance(
          this.configDomain
        )
      )(CONFIG_TABLE_PREFIX(this.configDomain)).insert({
        key,
        value: JSON.stringify(value),
      });
    }
  }

  async removeItem(key: string): Promise<void> {
    await (
      await DatabaseConfigDataPersistenceAdaptor.getDbInstance(
        this.configDomain
      )
    )(CONFIG_TABLE_PREFIX(this.configDomain))
      .where({ key })
      .del();
  }

  async saveAllItems(keyField: keyof T, values: T[]) {
    await (
      await DatabaseConfigDataPersistenceAdaptor.getDbInstance(
        this.configDomain
      )
    )(CONFIG_TABLE_PREFIX(this.configDomain)).insert(
      values.map((value) => ({
        key: value[keyField],
        value: JSON.stringify(value),
      }))
    );
  }
}
