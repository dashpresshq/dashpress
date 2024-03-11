import {
  AbstractConfigDataPersistenceService,
  createConfigDomainPersistenceService,
} from "../config-persistence";
import { KeyValueDomain } from "./types";

interface IStorage {
  data: string;
}

export class KeyValueStoreApiService<T> {
  constructor(
    private readonly key: KeyValueDomain,
    private readonly _keyValueStorePersistenceService: AbstractConfigDataPersistenceService<IStorage>
  ) {}

  async clearItem() {
    await this._keyValueStorePersistenceService.removeItem(this.key);
  }

  async persistItem(data: T) {
    await this._keyValueStorePersistenceService.persistItem(this.key, {
      data: JSON.stringify(data),
    });
  }

  async getItem(): Promise<T | null> {
    const data = await this._keyValueStorePersistenceService.getItem(
      this.key,
      null
    );
    if (!data) {
      return null;
    }
    return JSON.parse(data.data) as T;
  }
}

const keyValueStorePersistenceService =
  createConfigDomainPersistenceService<IStorage>("key-value");

export function createKeyValueDomainPersistenceService<T>(
  keyValueDomain: KeyValueDomain
) {
  return new KeyValueStoreApiService<T>(
    keyValueDomain,
    keyValueStorePersistenceService
  );
}
