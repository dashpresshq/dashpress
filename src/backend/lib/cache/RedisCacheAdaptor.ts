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
        ConfigKeys.CACHE_ADAPTOR_CONNECTION_STRING
      )
    );
    return this.redisConnection;
  }

  async setup() {
    await this.getRedisInstance();
  }

  public async pullItem<T>(key: string): Promise<T> {
    const data = await (await this.getRedisInstance()).get(key);
    if (!data) {
      return undefined;
    }
    return JSON.parse(data);
  }

  public async persistData(key: string, data: unknown): Promise<void> {
    await (await this.getRedisInstance()).set(key, JSON.stringify(data));
  }

  async clearItem(key: string) {
    await (await this.getRedisInstance()).del(this.prefixKey(key));
  }
}
