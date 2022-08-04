import { RedisClientType } from "redis";
import { ConfigService } from "../config/config.service";
import { getRedisConnection } from "../connection/redis";
import { AbstractConfigDataPersistenceService } from "./AbstractConfigDataPersistenceService";
import { ConfigDomain } from "./types";

export class RedisConfigDataPersistenceAdaptor<
  T
> extends AbstractConfigDataPersistenceService<T> {
  private redisConnection: RedisClientType;

  async setup() {}

  async getRedisInstance() {
    if (this.redisConnection) {
      return this.redisConnection;
    }
    this.redisConnection = await getRedisConnection();
    return this.redisConnection;
  }

  constructor() {
    super();
  }

  private wrapWithConfigDomain() {
    return `__app_config__${this.configDomain}`;
  }

  async getAllItems() {
    const allData = await (
      await this.getRedisInstance()
    ).hGetAll(this.wrapWithConfigDomain());
    return Object.values(allData).map((value) => JSON.parse(value));
  }

  async getItem(key: string) {
    return JSON.parse(
      await (
        await this.getRedisInstance()
      ).hGet(this.wrapWithConfigDomain(), key)
    );
  }

  async upsertItem(key: string, data: T) {
    await (
      await this.getRedisInstance()
    ).hSet(this.wrapWithConfigDomain(), { [key]: JSON.stringify(data) });
  }

  public async removeItem(key: string): Promise<void> {
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
