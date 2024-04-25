import { RedisClientType } from "redis";
import { typescriptSafeObjectDotEntries } from "shared/lib/objects";
import { ConfigKeys, ConfigApiService } from "../config/config.service";
import { getRedisConnection } from "../connection/redis";
import { AbstractConfigDataPersistenceService } from "./AbstractConfigDataPersistenceService";
import { ConfigDomain } from "./types";

export class RedisConfigDataPersistenceAdaptor<
  T
> extends AbstractConfigDataPersistenceService<T> {
  static _redisConnection: Record<string, RedisClientType | null> = {};

  async getRedisInstance(): Promise<RedisClientType> {
    if (
      RedisConfigDataPersistenceAdaptor._redisConnection[this._configDomain]
    ) {
      return RedisConfigDataPersistenceAdaptor._redisConnection[
        this._configDomain
      ];
    }
    RedisConfigDataPersistenceAdaptor._redisConnection[this._configDomain] =
      await getRedisConnection(
        this._configApiService.getConfigValue(
          ConfigKeys.CONFIG_ADAPTOR_CONNECTION_STRING
        )
      );
    return RedisConfigDataPersistenceAdaptor._redisConnection[
      this._configDomain
    ];
  }

  getItemLastUpdated() {
    return null;
  }

  constructor(configDomain: ConfigDomain, _configApiService: ConfigApiService) {
    super(configDomain, _configApiService);
  }

  async _resetToEmpty() {
    await (await this.getRedisInstance()).del(this.wrapWithConfigDomain());
  }

  private wrapWithConfigDomain() {
    return `__app_config__${this._configDomain}`;
  }

  async getAllAsKeyValuePair() {
    const allData = await (
      await this.getRedisInstance()
    ).hGetAll(this.wrapWithConfigDomain());

    return Object.fromEntries(
      typescriptSafeObjectDotEntries(allData).map(([key, value]) => [
        key,
        JSON.parse(value),
      ])
    );
  }

  async getAllItems() {
    return Object.values(await this.getAllAsKeyValuePair());
  }

  async getAllItemsIn(itemIds: string[]) {
    const allData = await (
      await this.getRedisInstance()
    ).hmGet(this.wrapWithConfigDomain(), itemIds);

    return Object.fromEntries(
      allData.map((value, index) => [itemIds[index], JSON.parse(value)])
    );
  }

  async _getItem(key: string) {
    return JSON.parse(
      await (
        await this.getRedisInstance()
      ).hGet(this.wrapWithConfigDomain(), key)
    );
  }

  async _persistItem(key: string, data: T) {
    await (
      await this.getRedisInstance()
    ).hSet(this.wrapWithConfigDomain(), { [key]: JSON.stringify(data) });
  }

  async _removeItem(key: string): Promise<void> {
    await (
      await this.getRedisInstance()
    ).hDel(this.wrapWithConfigDomain(), key);
  }

  async saveAllItems(keyField: keyof T, data: T[]) {
    await (
      await this.getRedisInstance()
    ).hSet(
      this.wrapWithConfigDomain(),
      Object.fromEntries(
        data.map((datum) => [datum[keyField], JSON.stringify(datum)])
      )
    );
  }
}
