import { Knex } from "knex";
import { ConfigKeys, ConfigApiService } from "../config/config.service";
import { getDbConnection } from "../connection/db";
import { AbstractConfigDataPersistenceService } from "./AbstractConfigDataPersistenceService";
import { ConfigDomain } from "./types";

const CONFIG_TABLE_PREFIX = (domain: string) => `hadmean__${domain}`;

export class DatabaseConfigDataPersistenceAdaptor<
  T
> extends AbstractConfigDataPersistenceService<T> {
  static _dbInstance: Record<string, Knex | null> = {};

  constructor(configDomain: ConfigDomain, _configApiService: ConfigApiService) {
    super(configDomain, _configApiService);
  }

  async getDbInstance(): Promise<Knex> {
    if (DatabaseConfigDataPersistenceAdaptor._dbInstance[this._configDomain]) {
      return DatabaseConfigDataPersistenceAdaptor._dbInstance[
        this._configDomain
      ];
    }

    DatabaseConfigDataPersistenceAdaptor._dbInstance[this._configDomain] =
      await getDbConnection(
        this._configApiService.getConfigValue(
          ConfigKeys.CONFIG_ADAPTOR_CONNECTION_STRING
        )
      );

    if (
      !(await DatabaseConfigDataPersistenceAdaptor._dbInstance[
        this._configDomain
      ].schema.hasTable(CONFIG_TABLE_PREFIX(this._configDomain)))
    ) {
      await DatabaseConfigDataPersistenceAdaptor._dbInstance[
        this._configDomain
      ].schema.createTableIfNotExists(
        CONFIG_TABLE_PREFIX(this._configDomain),
        (table) => {
          const connection =
            DatabaseConfigDataPersistenceAdaptor._dbInstance[
              this._configDomain
            ];
          table.increments("id");
          table.string("key").notNullable().unique();
          table.text("value");
          table
            .timestamp("created_at")
            .defaultTo(connection.raw("CURRENT_TIMESTAMP"));
          table
            .timestamp("updated_at")
            .defaultTo(connection.raw("CURRENT_TIMESTAMP"));
        }
      );
    }

    return DatabaseConfigDataPersistenceAdaptor._dbInstance[this._configDomain];
  }

  async setup() {
    await this.getDbInstance();
  }

  async resetToEmpty() {
    await (
      await this.getDbInstance()
    )(CONFIG_TABLE_PREFIX(this._configDomain)).del();
  }

  async getAllAsKeyValuePair(): Promise<Record<string, T>> {
    const query = (await this.getDbInstance())
      .select(["value", "key"])
      .from(CONFIG_TABLE_PREFIX(this._configDomain));

    const items = await query;

    return Object.fromEntries(
      items.map(({ value, key }) => [key, JSON.parse(value)])
    );
  }

  async getAllItems() {
    return Object.values(await this.getAllAsKeyValuePair());
  }

  async getAllItemsIn(itemIds: string[]) {
    const query = (await this.getDbInstance())
      .select(["value", "key"])
      .whereIn("key", itemIds)
      .from(CONFIG_TABLE_PREFIX(this._configDomain));

    const items = await query;

    return items.map(({ value }) => JSON.parse(value));
  }

  async getItem(key: string) {
    const connection = await this.getDbInstance();
    const queryResponse = await connection
      .table(CONFIG_TABLE_PREFIX(this._configDomain))
      .select(["value"])
      .where({ key })
      .first();

    if (!queryResponse) {
      return queryResponse;
    }

    return JSON.parse(queryResponse.value);
  }

  async getItemLastUpdated(key: string) {
    try {
      const queryResponse = await (await this.getDbInstance())
        .table(CONFIG_TABLE_PREFIX(this._configDomain))
        .select(["updated_at"])
        .where({ key })
        .first();

      if (!queryResponse) {
        return null;
      }

      return new Date(queryResponse.updated_at);
    } catch (error) {
      return null;
    }
  }

  async persistItem(key: string, value: T) {
    const affectedRowsCount = await (
      await this.getDbInstance()
    )(CONFIG_TABLE_PREFIX(this._configDomain))
      .where({ key })
      .update({
        value: JSON.stringify(value),
        updated_at: new Date(),
      });
    if (affectedRowsCount === 0) {
      await (
        await this.getDbInstance()
      )(CONFIG_TABLE_PREFIX(this._configDomain)).insert({
        key,
        value: JSON.stringify(value),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
  }

  async removeItem(key: string): Promise<void> {
    await (await this.getDbInstance())(CONFIG_TABLE_PREFIX(this._configDomain))
      .where({ key })
      .del();
  }

  async saveAllItems(keyField: keyof T, values: T[]) {
    await (
      await this.getDbInstance()
    )(CONFIG_TABLE_PREFIX(this._configDomain)).insert(
      values.map((value) => ({
        key: value[keyField],
        value: JSON.stringify(value),
      }))
    );
  }
}
