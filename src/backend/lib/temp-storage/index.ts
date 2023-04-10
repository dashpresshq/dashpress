import { addHours, isBefore } from "date-fns";
import {
  AbstractConfigDataPersistenceService,
  createConfigDomainPersistenceService,
} from "../config-persistence";

interface ITempStorage {
  data: unknown;
  expiryDate: Date;
}

export class TempStorageApiService {
  constructor(
    private readonly _tempStoragePersistenceService: AbstractConfigDataPersistenceService<ITempStorage>
  ) {}

  async bootstrap() {
    await this._tempStoragePersistenceService.setup();
  }

  async clearItem(key: string) {
    await this._tempStoragePersistenceService.removeItem(key);
  }

  async persistItem(key: string, data: unknown, numberOfHours: number) {
    await this._tempStoragePersistenceService.persistItem(key, {
      data,
      expiryDate: addHours(new Date(), numberOfHours),
    });
  }

  async getItem<T>(key: string): Promise<T | null> {
    const data = await this._tempStoragePersistenceService.getItem(key);
    if (!data) {
      return null;
    }
    if (isBefore(new Date(data.expiryDate), new Date())) {
      this.clearItem(key);
      return null;
    }
    return data.data as T;
  }
}

const tempStoragePersistenceService =
  createConfigDomainPersistenceService<ITempStorage>("temp-storage");

export const tempStorageApiService = new TempStorageApiService(
  tempStoragePersistenceService
);
