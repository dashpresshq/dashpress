import { isNotEmpty } from "class-validator";
import { ConfigApiService } from "../config/config.service";

export abstract class AbstractCacheService {
  protected readonly prefix!: string;

  protected readonly _configApiService!: ConfigApiService;

  constructor(prefix: string, configApiService: ConfigApiService) {
    this.prefix = prefix;
    this._configApiService = configApiService;
  }

  public abstract setup(): Promise<void>;

  protected prefixKey(key: string) {
    return `${this.prefix}:${key}`;
  }

  abstract pullItem<T>(key: string): Promise<T | undefined>;

  abstract persistData(key: string, data: unknown): Promise<void>;

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
