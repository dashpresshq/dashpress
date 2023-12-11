import { ConfigApiService } from "../config/config.service";

export abstract class AbstractCacheService {
  protected readonly _configApiService!: ConfigApiService;

  constructor(configApiService: ConfigApiService) {
    this._configApiService = configApiService;
  }

  public abstract setup(): Promise<void>;

  private prefixKey(key: string) {
    return `__dp__:${key}`;
  }

  abstract pullItem<T>(key: string): Promise<T | undefined>;

  abstract persistData(key: string, data: unknown): Promise<void>;

  abstract clearItem(key: string): Promise<void>;

  abstract purge(): Promise<void>;

  async getItem<T>(rawKey: string, fetcher: () => Promise<T>) {
    const key = this.prefixKey(rawKey);

    const data = await this.pullItem<T>(key);

    if (data !== undefined) {
      return data;
    }

    const fetchedData = await fetcher();

    await this.persistData(key, fetchedData || null);

    return fetchedData;
  }
}
