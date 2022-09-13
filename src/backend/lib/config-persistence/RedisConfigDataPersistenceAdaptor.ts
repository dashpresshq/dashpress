import { RedisClientType } from "redis";
import {
  ConfigKeys,
  ConfigService,
  configService,
} from "../config/config.service";
import { getRedisConnection } from "../connection/redis";
import { AbstractConfigDataPersistenceService } from "./AbstractConfigDataPersistenceService";
import { ConfigDomain } from "./types";

export class RedisConfigDataPersistenceAdaptor<
  T
> extends AbstractConfigDataPersistenceService<T> {
  static _redisConnection: Record<string, RedisClientType | null> = {};

  static async getRedisInstance(
    configDomain: ConfigDomain
  ): Promise<RedisClientType> {
    if (this._redisConnection[configDomain]) {
      return this._redisConnection[configDomain];
    }
    this._redisConnection[configDomain] = await getRedisConnection(
      configService.getConfigValue(ConfigKeys.CONFIG_ADAPTOR_CONNECTION_STRING)
    );
    return this._redisConnection[configDomain];
  }

  async setup() {
    await RedisConfigDataPersistenceAdaptor.getRedisInstance(this.configDomain);
  }

  constructor(configDomain: ConfigDomain, _configService: ConfigService) {
    super(configDomain, _configService);
  }

  async resetToEmpty() {
    await (
      await RedisConfigDataPersistenceAdaptor.getRedisInstance(
        this.configDomain
      )
    ).del(this.wrapWithConfigDomain());
  }

  private wrapWithConfigDomain() {
    return `__app_config__${this.configDomain}`;
  }

  async getAllItems() {
    const allData = await (
      await RedisConfigDataPersistenceAdaptor.getRedisInstance(
        this.configDomain
      )
    ).hGetAll(this.wrapWithConfigDomain());
    return Object.values(allData).map((value) => JSON.parse(value));
  }

  async getAllItemsIn(itemIds: string[]) {
    const allData = await (
      await RedisConfigDataPersistenceAdaptor.getRedisInstance(
        this.configDomain
      )
    ).hmGet(this.wrapWithConfigDomain(), itemIds);
    // :eyes
    return Object.values(allData).map((value) => JSON.parse(value));
  }

  async getItem(key: string) {
    return JSON.parse(
      await (
        await RedisConfigDataPersistenceAdaptor.getRedisInstance(
          this.configDomain
        )
      ).hGet(this.wrapWithConfigDomain(), key)
    );
  }

  async upsertItem(key: string, data: T) {
    await (
      await RedisConfigDataPersistenceAdaptor.getRedisInstance(
        this.configDomain
      )
    ).hSet(this.wrapWithConfigDomain(), { [key]: JSON.stringify(data) });
  }

  public async removeItem(key: string): Promise<void> {
    await (
      await RedisConfigDataPersistenceAdaptor.getRedisInstance(
        this.configDomain
      )
    ).hDel(this.wrapWithConfigDomain(), key);
  }

  async saveAllItems(keyField: keyof T, data: T[]) {
    await (
      await RedisConfigDataPersistenceAdaptor.getRedisInstance(
        this.configDomain
      )
    ).hSet(
      this.wrapWithConfigDomain(),
      Object.fromEntries(
        data.map((datum) => [datum[keyField], JSON.stringify(datum)])
      )
    );
  }
}
