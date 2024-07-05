import { createCacheService } from "../cache";
import type { ConfigApiService } from "../config/config.service";
import { NotFoundError } from "../errors";
import type { ConfigDomain } from "./types";

const cacheService = createCacheService();

export abstract class AbstractConfigDataPersistenceService<T> {
  protected readonly _configDomain!: ConfigDomain;

  protected readonly _configApiService!: ConfigApiService;

  constructor(configDomain: ConfigDomain, configApiService: ConfigApiService) {
    this._configDomain = configDomain;
    this._configApiService = configApiService;
  }

  public mergeKeyWithSecondaryKey(key: string, secondaryKey: string) {
    if (!secondaryKey) {
      return key;
    }
    return `${key}__${secondaryKey}`;
  }

  protected abstract _getItem(key: string): Promise<T | undefined>;

  protected abstract _persistItem(key: string, data: T): Promise<void>;

  protected abstract _removeItem(key: string): Promise<void>;

  public async getItem(key: string, defaultValue: T) {
    return await cacheService.getItem(key, this._configDomain, async () => {
      return (await this._getItem(key)) || defaultValue;
    });
  }

  public async hasItem(key: string): Promise<boolean> {
    return !!(await cacheService.getItem(key, this._configDomain, async () => {
      return await this._getItem(key);
    }));
  }

  public async persistItem(key: string, data: T) {
    await cacheService.clearItem(key, this._configDomain);
    await this._persistItem(key, data);
  }

  public async removeItem(key: string) {
    await cacheService.clearItem(key, this._configDomain);
    await this._removeItem(key);
  }

  public abstract getItemLastUpdated(key: string): Promise<Date>;

  public async getItemOrFail(key: string): Promise<T> {
    const data = await this.getItem(key, undefined);
    if (data) {
      return data;
    }
    throw new NotFoundError(`${key} not found for '${this._configDomain}'`);
  }

  public abstract getAllItemsIn(itemIds: string[]): Promise<Record<string, T>>;

  public abstract getAllAsKeyValuePair(): Promise<Record<string, T>>;

  public abstract getAllItems(): Promise<T[]>;

  public async upsertItem(key: string, data: T): Promise<void> {
    await this.persistItem(key, data);
  }

  public async createItem(key: string, data: T): Promise<void> {
    await this.persistItem(key, data);
  }

  public async resetState(keyField: keyof T, data: T[]) {
    await this.resetToEmpty();
    await this.saveAllItems(keyField, data);
  }

  protected abstract saveAllItems(keyField: keyof T, data: T[]): Promise<void>;

  public async resetToEmpty() {
    await cacheService.purge();
    await this._resetToEmpty();
  }

  protected abstract _resetToEmpty(): Promise<void>;
}
