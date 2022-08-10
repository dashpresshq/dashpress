import { isNotEmpty } from "class-validator";
import { RedisClientType } from "redis";
import { ConfigKeys, ConfigService } from "../config/config.service";
import { getRedisConnection } from "../connection/redis";
import { AbstractCacheService } from "./AbstractCacheService";

export class RedisCacheAdaptor extends AbstractCacheService {
  private redisConnection: RedisClientType;

  constructor(prefix: string, configService: ConfigService) {
    super(prefix, configService);
  }

  async getRedisInstance() {
    if (this.redisConnection) {
      return this.redisConnection;
    }
    this.redisConnection = await getRedisConnection(
      this.configService.getConfigValue(
        ConfigKeys.CONFIG_CACHE_CONNECTION_STRING
      )
    );
    return this.redisConnection;
  }

  private prefixKey(key: string) {
    return `${this.prefix}:${key}`;
  }

  async getItem<T>(rawKey: string, fetcher: () => Promise<T>) {
    const key = this.prefixKey(rawKey);

    const data = await (await this.getRedisInstance()).get(key);

    if (isNotEmpty(data)) {
      return JSON.parse(data) as T;
    }

    const fetchedData = await fetcher();

    await (await this.getRedisInstance()).set(key, JSON.stringify(fetchedData));

    return fetchedData;
  }

  async clearItem(key: string) {
    await (await this.getRedisInstance()).del(this.prefixKey(key));
  }
}
