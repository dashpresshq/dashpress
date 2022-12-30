import { StorageService, storageService } from "./storage.service";

export class StorageController {
  constructor(private _storageService: StorageService) {}

  listIntegrations() {
    return this._storageService.listStorageIntegrations();
  }

  async listActivatedStorage() {
    return await this._storageService.listActivatedStorage();
  }

  async activateStorage(
    storageKey: string,
    configuration: Record<string, string>
  ) {
    await this._storageService.activateStorage(storageKey, configuration);
  }

  async showStorageConfig(storageKey: string) {
    return await this._storageService.showStorageConfig(storageKey);
  }

  async updateStorageConfig(
    storageKey: string,
    configuration: Record<string, string>
  ) {
    await this._storageService.updateStorageConfig(storageKey, configuration);
  }

  async deactivateStorage(storageKey: string) {
    await this._storageService.deactivateStorage(storageKey);
  }
}

export const storageController = new StorageController(storageService);
