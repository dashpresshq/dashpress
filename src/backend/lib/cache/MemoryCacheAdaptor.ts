import { ConfigService } from "../config/config.service";
import { AbstractCacheService } from "./AbstractCacheService";

export class MemoryCacheAdaptor extends AbstractCacheService {
  private data: Record<string, unknown> = {};

  constructor(prefix: string, configService: ConfigService) {
    super(prefix, configService);
  }

  public async pullItem<T>(key: string): Promise<T | undefined> {
    return this.data[key] as T;
  }

  public async persistData(key: string, data: unknown): Promise<void> {
    this.data[key] = data;
  }

  async clearItem(key: string) {
    delete this.data[this.prefixKey(key)];
  }
}
