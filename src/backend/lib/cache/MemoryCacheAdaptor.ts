import { noop } from "shared/lib/noop";
import { ConfigApiService } from "../config/config.service";
import { AbstractCacheService } from "./AbstractCacheService";

export class MemoryCacheAdaptor extends AbstractCacheService {
  static data: Record<string, unknown> = {};

  constructor(configApiService: ConfigApiService) {
    super(configApiService);
    MemoryCacheAdaptor.data = {};
  }

  async setup() {
    noop();
  }

  async pullItem<T>(key: string): Promise<T | undefined> {
    return MemoryCacheAdaptor.data[key] as T;
  }

  async persistData(key: string, data: unknown): Promise<void> {
    MemoryCacheAdaptor.data[key] = data;
  }

  async _clearItem(key: string) {
    delete MemoryCacheAdaptor.data[key];
  }

  async purge() {
    MemoryCacheAdaptor.data = {};
  }
}
