import { Knex } from "knex";
import { ConfigKeys, ConfigApiService } from "../config/config.service";
import { getDbConnection } from "../connection/db";
import { AbstractConfigDataPersistenceService } from "./AbstractConfigDataPersistenceService";
import { ConfigDomain } from "./types";
// import { CONFIG_TABLE_PREFIX } from "./constants";

const CONFIG_TABLE_NAME = "hadmean_config"; // CONFIG_TABLE_PREFIX("config");

export class DatabaseConfigDataPersistenceAdaptor<
  T
> extends AbstractConfigDataPersistenceService<T> {
  static _dbInstance: Knex | null = null;

  constructor(configDomain: ConfigDomain, _configApiService: ConfigApiService) {
    super(configDomain, _configApiService);
  }

  async getDbInstance(): Promise<Knex> {
    if (DatabaseConfigDataPersistenceAdaptor._dbInstance) {
      return DatabaseConfigDataPersistenceAdaptor._dbInstance;
    }

    DatabaseConfigDataPersistenceAdaptor._dbInstance = await getDbConnection(
      this._configApiService.getConfigValue(
        ConfigKeys.CONFIG_ADAPTOR_CONNECTION_STRING
      )
    );

    if (
      !(await DatabaseConfigDataPersistenceAdaptor._dbInstance.schema.hasTable(
        CONFIG_TABLE_NAME
      ))
    ) {
      await DatabaseConfigDataPersistenceAdaptor._dbInstance.schema.createTableIfNotExists(
        CONFIG_TABLE_NAME,
        (table) => {
          const connection = DatabaseConfigDataPersistenceAdaptor._dbInstance;
          table.increments("id");
          table.string("domain").notNullable();
          table.string("key").notNullable();
          table.text("value");
          table
            .timestamp("created_at")
            .defaultTo(connection.raw("CURRENT_TIMESTAMP"));
          table
            .timestamp("updated_at")
            .defaultTo(connection.raw("CURRENT_TIMESTAMP"));

          table.unique(["domain", "key"]);
        }
      );
    }

    return DatabaseConfigDataPersistenceAdaptor._dbInstance;
  }

  async setup() {
    await this.getDbInstance();
  }

  async resetToEmpty() {
    await (await this.getDbInstance())(CONFIG_TABLE_NAME)
      .where("domain", "=", this._configDomain)
      .del();
  }

  async getAllAsKeyValuePair(): Promise<Record<string, T>> {
    const query = (await this.getDbInstance())
      .select(["value", "key"])
      .where("domain", "=", this._configDomain)
      .from(CONFIG_TABLE_NAME);

    const items = await query;

    return Object.fromEntries(
      items.map(({ value, key }) => [key, JSON.parse(value)])
    );
  }

  async getAllItems() {
    return Object.values(await this.getAllAsKeyValuePair());
  }

  async getAllItemsIn(itemIds: string[]) {
    const items = await (await this.getDbInstance())
      .select(["value", "key"])
      .whereIn("key", itemIds)
      .where("domain", "=", this._configDomain)
      .from(CONFIG_TABLE_NAME);

    return items.map(({ value }) => JSON.parse(value));
  }

  async getItem(key: string) {
    const connection = await this.getDbInstance();
    const queryResponse = await connection
      .table(CONFIG_TABLE_NAME)
      .select(["value"])
      .where({ key })
      .where("domain", "=", this._configDomain)
      .first();

    if (!queryResponse) {
      return queryResponse;
    }

    return JSON.parse(queryResponse.value);
  }

  async getItemLastUpdated(key: string) {
    try {
      const queryResponse = await (await this.getDbInstance())
        .table(CONFIG_TABLE_NAME)
        .select(["updated_at"])
        .where({ key })
        .where("domain", "=", this._configDomain)
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
    )(CONFIG_TABLE_NAME)
      .where({ key })
      .where("domain", "=", this._configDomain)
      .update({
        value: JSON.stringify(value),
        updated_at: new Date(),
      });
    if (affectedRowsCount === 0) {
      await (
        await this.getDbInstance()
      )(CONFIG_TABLE_NAME).insert({
        key,
        domain: this._configDomain,
        value: JSON.stringify(value),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
  }

  async removeItem(key: string): Promise<void> {
    await (
      await this.getDbInstance()
    )(CONFIG_TABLE_NAME)
      .where("domain", "=", this._configDomain)

      .where({ key })
      .del();
  }

  async saveAllItems(keyField: keyof T, values: T[]) {
    await (
      await this.getDbInstance()
    )(CONFIG_TABLE_NAME).insert(
      values.map((value) => ({
        key: value[keyField],
        domain: this._configDomain,
        value: JSON.stringify(value),
      }))
    );
  }
}
