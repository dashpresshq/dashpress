import { ConfigDomain } from "../config-persistence/types";
import { ConfigApiService } from "../config/config.service";

export abstract class AbstractCacheService {
  protected readonly _configApiService!: ConfigApiService;

  constructor(configApiService: ConfigApiService) {
    this._configApiService = configApiService;
  }

  public abstract setup(): Promise<void>;

  private prefixKey(key: string, domain: ConfigDomain) {
    return `__dp__:${domain}:${key}`;
  }

  protected abstract pullItem<T>(key: string): Promise<T | undefined>;

  protected abstract persistData(key: string, data: unknown): Promise<void>;

  protected abstract _clearItem(key: string): Promise<void>;

  async clearItem(rawKey: string, domain: ConfigDomain) {
    await this._clearItem(this.prefixKey(rawKey, domain));
  }

  abstract purge(): Promise<void>;

  async getItem<T>(
    rawKey: string,
    domain: ConfigDomain,
    fetcher: () => Promise<T>
  ) {
    const key = this.prefixKey(rawKey, domain);

    const data = await this.pullItem<T>(key);

    if (data !== undefined) {
      return data;
    }

    const fetchedData = await fetcher();

    await this.persistData(key, fetchedData || null);

    return fetchedData;
  }
}
