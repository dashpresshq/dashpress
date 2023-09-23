import {
  AbstractConfigDataPersistenceService,
  createConfigDomainPersistenceService,
} from "../config-persistence";

interface IStorge {
  data: string;
}

export class KeyValueStoreApiService {
  constructor(
    private readonly _keyValueStorePersistenceService: AbstractConfigDataPersistenceService<IStorge>
  ) {}

  async bootstrap() {
    await this._keyValueStorePersistenceService.setup();
  }

  async clearItem(key: string) {
    await this._keyValueStorePersistenceService.removeItem(key);
  }

  async persistItem(key: string, data: unknown) {
    await this._keyValueStorePersistenceService.persistItem(key, {
      data: JSON.stringify(data),
    });
  }

  async getItem<T>(key: string): Promise<T | null> {
    const data = await this._keyValueStorePersistenceService.getItem(key);
    if (!data) {
      return null;
    }
    return JSON.parse(data.data) as T;
  }
}

const keyValueStorePersistenceService =
  createConfigDomainPersistenceService<IStorge>("key-value");

export const keyValueStoreApiService = new KeyValueStoreApiService(
  keyValueStorePersistenceService
);
