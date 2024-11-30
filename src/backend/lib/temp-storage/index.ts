import { addSeconds, isBefore } from "date-fns";

import type { AbstractConfigDataPersistenceService } from "../config-persistence";
import { createConfigDomainPersistenceService } from "../config-persistence";

interface ITempStorage {
  data: string;
  expiryDate: Date;
}

export class TempStorageApiService {
  constructor(
    private readonly _tempStoragePersistenceService: AbstractConfigDataPersistenceService<ITempStorage>
  ) {}

  async clearItem(key: string) {
    await this._tempStoragePersistenceService.removeItem(key);
  }

  async persistItem(key: string, data: unknown, numberOfSeconds: number) {
    await this._tempStoragePersistenceService.persistItem(key, {
      data: JSON.stringify(data),
      expiryDate: addSeconds(new Date(), numberOfSeconds),
    });
  }

  async getItem<T>(key: string): Promise<T | null> {
    const data = await this._tempStoragePersistenceService.getItem(key, null);
    if (!data) {
      return null;
    }
    if (isBefore(new Date(data.expiryDate), new Date())) {
      await this.clearItem(key);
      return null;
    }
    return JSON.parse(data.data) as T;
  }
}

const tempStoragePersistenceService =
  createConfigDomainPersistenceService<ITempStorage>("temp-storage");

export const tempStorageApiService = new TempStorageApiService(
  tempStoragePersistenceService
);
