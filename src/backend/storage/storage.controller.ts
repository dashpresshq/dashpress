import { StorageApiService, storageApiService } from "./storage.service";

export class StorageApiController {
  constructor(private _storageApiService: StorageApiService) {}

  listIntegrations() {
    return this._storageApiService.listStorageIntegrations();
  }

  async activateStorage({
    storageKey,
    configuration,
  }: {
    storageKey: string;
    configuration: Record<string, string>;
  }) {
    await this._storageApiService.activateStorage(storageKey, configuration);
  }

  async getCurrentActivatedStorage() {
    return {
      data: await this._storageApiService.getCurrentActivatedStorage(),
    };
  }

  async showStorageCredentials() {
    return await this._storageApiService.showStorageCredentials();
  }
}

export const storageApiController = new StorageApiController(storageApiService);
