import { noop } from "shared/lib/noop";
import { ConfigApiService } from "../config/config.service";
import { AbstractCacheService } from "./AbstractCacheService";

export class MemoryCacheAdaptor extends AbstractCacheService {
  static data: Record<string, unknown> = {};

  constructor(configApiService: ConfigApiService) {
    super(configApiService);
    MemoryCacheAdaptor.data = {};
  }

  private getData(): Record<string, unknown> {
    return MemoryCacheAdaptor.data;
  }

  async setup() {
    noop();
  }

  async pullItem<T>(key: string): Promise<T | undefined> {
    return this.getData()[key] as T;
  }

  async persistData(key: string, data: unknown): Promise<void> {
    MemoryCacheAdaptor.data[key] = data;
  }

  async clearItem(key: string) {
    delete this.getData()[key];
  }

  async purge() {
    MemoryCacheAdaptor.data = {};
  }
}
