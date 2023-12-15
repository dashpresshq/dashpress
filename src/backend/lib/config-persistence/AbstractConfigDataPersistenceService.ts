import { createCacheService } from "../cache";
import { ConfigApiService } from "../config/config.service";
import { NotFoundError } from "../errors";
import { ConfigDomain } from "./types";

const cacheService = createCacheService();

export abstract class AbstractConfigDataPersistenceService<T> {
  protected readonly _configDomain!: ConfigDomain;

  protected readonly _configApiService!: ConfigApiService;

  public abstract setup(): Promise<void>;

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

  public abstract _getItem(key: string): Promise<T | undefined>;

  public abstract _persistItem(key: string, data: T): Promise<void>;

  public abstract _removeItem(key: string): Promise<void>;

  public async getItem(key: string) {
    return await cacheService.getItem(key, async () => {
      return this._getItem(key);
    });
  }

  public async persistItem(key: string, data: T) {
    await cacheService.clearItem(key);
    await this._persistItem(key, data);
  }

  public async removeItem(key: string) {
    await cacheService.clearItem(key);
    await this._removeItem(key);
  }

  public abstract getItemLastUpdated(key: string): Promise<Date>;

  public async getItemOrFail(key: string): Promise<T> {
    const data = await this.getItem(key);
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
    await cacheService.purge();
    await this.resetToEmpty();
    await this.saveAllItems(keyField, data);
  }

  protected abstract saveAllItems(keyField: keyof T, data: T[]): Promise<void>;

  public abstract resetToEmpty(): Promise<void>;
}
