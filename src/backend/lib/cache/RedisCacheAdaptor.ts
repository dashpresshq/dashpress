import type { RedisClientType } from "redis";
import type { ConfigApiService } from "../config/config.service";
import { ConfigKeys } from "../config/config.service";
import { getRedisConnection } from "../connection/redis";
import { AbstractCacheService } from "./AbstractCacheService";

export class RedisCacheAdaptor extends AbstractCacheService {
  private redisConnection: RedisClientType;

  constructor(_configApiService: ConfigApiService) {
    super(_configApiService);
  }

  async getRedisInstance() {
    if (this.redisConnection) {
      return this.redisConnection;
    }
    this.redisConnection = await getRedisConnection(
      this._configApiService.getConfigValue(
        ConfigKeys.CACHE_ADAPTOR_CONNECTION_STRING
      )
    );
    return this.redisConnection;
  }

  async setup() {
    await this.getRedisInstance();
  }

  async pullItem<T>(key: string): Promise<T> {
    const data = await (await this.getRedisInstance()).get(key);
    if (!data) {
      return undefined;
    }
    return JSON.parse(data);
  }

  async persistData(key: string, data: unknown): Promise<void> {
    await (
      await this.getRedisInstance()
    ).set(key, JSON.stringify(data), { EX: 60 * 60 }); // I hour
  }

  async _clearItem(key: string) {
    await (await this.getRedisInstance()).del(key);
  }

  async purge() {
    await (await this.getRedisInstance()).flushAll();
  }
}
