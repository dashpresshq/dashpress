import { isNotEmpty } from "class-validator";
import { ConfigService } from "../config/config.service";
import { AbstractCacheService } from "./AbstractCacheService";

export class MemoryCacheAdaptor extends AbstractCacheService {
  private data: Record<string, unknown> = {};

  constructor(prefix: string, configService: ConfigService) {
    super(prefix, configService);
  }

  private prefixKey(key: string) {
    return `${this.prefix}:${key}`;
  }

  async getItem<T>(rawKey: string, fetcher: () => Promise<T>) {
    const key = this.prefixKey(rawKey);

    const data = this.data[key];

    if (isNotEmpty(data)) {
      return data as T;
    }

    const fetchedData = await fetcher();

    this.data[key] = fetchedData;

    return fetchedData;
  }

  async clearItem(key: string) {
    delete this.data[this.prefixKey(key)];
  }
}
