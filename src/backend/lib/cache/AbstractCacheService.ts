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

  protected abstract pullItem<T>(key: string): Promise<T | undefined>;

  protected abstract persistData(key: string, data: unknown): Promise<void>;

  protected abstract _clearItem(key: string): Promise<void>;

  async clearItem(rawKey: string) {
    await this._clearItem(this.prefixKey(rawKey));
  }

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
