import { Knex } from "knex";
import { ConfigKeys, ConfigService } from "../config/config.service";
import { getDbConnection } from "../connection/db";
import { AbstractConfigDataPersistenceService } from "./AbstractConfigDataPersistenceService";
import { ConfigDomain } from "./types";

const CONFIG_TABLE_PREFIX = (domain: string) => `hadmean__${domain}`;

export class DatabaseConfigDataPersistenceAdaptor<
  T
> extends AbstractConfigDataPersistenceService<T> {
  static _dbInstance: Record<string, Knex | null> = {};

  async getDbInstance(): Promise<Knex> {
    if (DatabaseConfigDataPersistenceAdaptor._dbInstance[this.configDomain]) {
      return DatabaseConfigDataPersistenceAdaptor._dbInstance[
        this.configDomain
      ];
    }

    DatabaseConfigDataPersistenceAdaptor._dbInstance[this.configDomain] =
      await getDbConnection(
        this.configService.getConfigValue(
          ConfigKeys.CONFIG_ADAPTOR_CONNECTION_STRING
        )
      );

    if (
      !(await DatabaseConfigDataPersistenceAdaptor._dbInstance[
        this.configDomain
      ].schema.hasTable(CONFIG_TABLE_PREFIX(this.configDomain)))
    ) {
      await DatabaseConfigDataPersistenceAdaptor._dbInstance[
        this.configDomain
      ].schema.createTableIfNotExists(
        CONFIG_TABLE_PREFIX(this.configDomain),
        (table) => {
          table.increments("id");
          table.string("key").notNullable().unique();
          table.text("value");
        }
      );
    }

    return DatabaseConfigDataPersistenceAdaptor._dbInstance[this.configDomain];
  }

  constructor(configDomain: ConfigDomain, _configService: ConfigService) {
    super(configDomain, _configService);
  }

  async setup() {
    await this.getDbInstance();
  }

  async resetToEmpty() {
    // TODO get those keys and delete only those key
    await (
      await this.getDbInstance()
    )(CONFIG_TABLE_PREFIX(this.configDomain)).del();
  }

  async getAllItems() {
    const query = (await this.getDbInstance())
      .select(["value", "key"])
      .from(CONFIG_TABLE_PREFIX(this.configDomain));

    const items = await query;

    return items.map(({ value }) => JSON.parse(value));
  }

  async getAllItemsIn(itemIds: string[]) {
    const query = (await this.getDbInstance())
      .select(["value", "key"])
      .whereIn("key", itemIds)
      .from(CONFIG_TABLE_PREFIX(this.configDomain));

    const items = await query;

    return items.map(({ value }) => JSON.parse(value));
  }

  async getItem(key: string) {
    const connection = await this.getDbInstance();
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
      await this.getDbInstance()
    )(CONFIG_TABLE_PREFIX(this.configDomain))
      .where({ key })
      .update({
        value: JSON.stringify(value),
      });
    if (affectedRowsCount === 0) {
      await (
        await this.getDbInstance()
      )(CONFIG_TABLE_PREFIX(this.configDomain)).insert({
        key,
        value: JSON.stringify(value),
      });
    }
  }

  async removeItem(key: string): Promise<void> {
    await (await this.getDbInstance())(CONFIG_TABLE_PREFIX(this.configDomain))
      .where({ key })
      .del();
  }

  async saveAllItems(keyField: keyof T, values: T[]) {
    await (
      await this.getDbInstance()
    )(CONFIG_TABLE_PREFIX(this.configDomain)).insert(
      values.map((value) => ({
        key: value[keyField],
        value: JSON.stringify(value),
      }))
    );
  }
}
