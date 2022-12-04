import { isNotEmpty } from "class-validator";
import { ConfigService } from "../config/config.service";

export abstract class AbstractCacheService {
  protected readonly prefix!: string;

  protected readonly configService!: ConfigService;

  constructor(prefix: string, configService: ConfigService) {
    this.prefix = prefix;
    this.configService = configService;
  }

  public abstract setup(): Promise<void>;

  protected prefixKey(key: string) {
    return `${this.prefix}:${key}`;
  }

  protected abstract pullItem<T>(key: string): Promise<T | undefined>;

  protected abstract persistData(key: string, data: unknown): Promise<void>;

  abstract clearItem(key: string): Promise<void>;

  abstract purge(): Promise<void>;

  async getItem<T>(rawKey: string, fetcher: () => Promise<T>) {
    const key = this.prefixKey(rawKey);

    const data = await this.pullItem<T>(key);

    if (isNotEmpty(data)) {
      return data;
    }

    const fetchedData = await fetcher();

    await this.persistData(key, fetchedData);

    return fetchedData;
  }
}
