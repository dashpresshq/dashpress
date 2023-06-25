import { noop } from "shared/lib/noop";
import { ConfigApiService } from "../config/config.service";
import { AbstractCacheService } from "./AbstractCacheService";

export class MemoryCacheAdaptor extends AbstractCacheService {
  static data: Record<string, Record<string, unknown>> = {};

  constructor(prefix: string, configApiService: ConfigApiService) {
    super(prefix, configApiService);
    MemoryCacheAdaptor.data[this.prefix] = {};
  }

  private getData(): Record<string, unknown> {
    return MemoryCacheAdaptor.data[this.prefix];
  }

  async setup() {
    noop();
  }

  async pullItem<T>(key: string): Promise<T | undefined> {
    return this.getData()[key] as T;
  }

  async persistData(key: string, data: unknown): Promise<void> {
    MemoryCacheAdaptor.data[this.prefix][key] = data;
  }

  async clearItem(key: string) {
    delete this.getData()[this.prefixKey(key)];
  }

  async purge() {
    MemoryCacheAdaptor.data[this.prefix] = {};
  }
}
