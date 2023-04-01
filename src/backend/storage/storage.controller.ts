import { StorageApiService, storageApiService } from "./storage.service";

export class StorageApiController {
  constructor(private _storageApiService: StorageApiService) {}

  listIntegrations() {
    return this._storageApiService.listStorageIntegrations();
  }

  async listActivatedStorage() {
    return await this._storageApiService.listActivatedStorage();
  }

  async activateStorage(
    storageKey: string,
    configuration: Record<string, string>
  ) {
    await this._storageApiService.activateStorage(storageKey, configuration);
  }

  async showStorageConfig(storageKey: string) {
    return await this._storageApiService.showStorageConfig(storageKey);
  }

  async updateStorageConfig(
    storageKey: string,
    configuration: Record<string, string>
  ) {
    await this._storageApiService.updateStorageConfig(
      storageKey,
      configuration
    );
  }

  async deactivateStorage(storageKey: string) {
    await this._storageApiService.deactivateStorage(storageKey);
  }
}

export const storageApiController = new StorageApiController(storageApiService);
