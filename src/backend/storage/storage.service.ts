import type { CredentialsApiService } from "backend/integrations-configurations";
import { credentialsApiService } from "backend/integrations-configurations";
import { validateSchemaRequestBody } from "backend/lib/errors/validate-schema-request-input";
import type { KeyValueStoreApiService } from "backend/lib/key-value";
import { createKeyValueDomainPersistenceService } from "backend/lib/key-value";
import {
  typescriptSafeObjectDotEntries,
  typescriptSafeObjectDotKeys,
} from "shared/lib/objects";
import { sluggify } from "shared/lib/strings";
import type { IStorageIntegration } from "shared/types/actions";

import { STORAGE_INTEGRATIONS } from "./integrations";

export class StorageApiService {
  constructor(
    private readonly _currentStorageKeyValueStoreApiService: KeyValueStoreApiService<string>,
    private readonly _credentialsApiService: CredentialsApiService
  ) {}

  listStorageIntegrations(): IStorageIntegration[] {
    return typescriptSafeObjectDotEntries(STORAGE_INTEGRATIONS).map(
      ([key, { title, integrationConfigurationSchema }]) => ({
        title,
        key,
        configurationSchema: integrationConfigurationSchema,
      })
    );
  }

  async activateStorage({
    configuration,
    storageKey,
  }: {
    storageKey: string;
    configuration: Record<string, string>;
  }): Promise<void> {
    validateSchemaRequestBody(
      STORAGE_INTEGRATIONS[storageKey].integrationConfigurationSchema,
      configuration
    );

    const previousStorageKey = await this.getCurrentActivatedStorage();
    if (previousStorageKey) {
      await this._credentialsApiService.deleteGroup({
        key: this.makeCredentialsGroupKey(storageKey),
        fields: typescriptSafeObjectDotKeys(
          STORAGE_INTEGRATIONS[previousStorageKey]
            .integrationConfigurationSchema
        ) as string[],
      });
    }

    await this._currentStorageKeyValueStoreApiService.persistItem(storageKey);

    await this._credentialsApiService.upsertGroup(
      {
        key: this.makeCredentialsGroupKey(storageKey),
        fields: typescriptSafeObjectDotKeys(
          STORAGE_INTEGRATIONS[storageKey].integrationConfigurationSchema
        ) as string[],
      },
      configuration
    );
  }

  async getCurrentActivatedStorage() {
    return await this._currentStorageKeyValueStoreApiService.getItem();
  }

  async showStorageCredentials(): Promise<Record<string, unknown>> {
    const storageKey = await this.getCurrentActivatedStorage();
    if (!storageKey) {
      return {};
    }
    return await this._credentialsApiService.useGroupValue({
      key: this.makeCredentialsGroupKey(storageKey),
      fields: typescriptSafeObjectDotKeys(
        STORAGE_INTEGRATIONS[storageKey].integrationConfigurationSchema
      ) as string[],
    });
  }

  private makeCredentialsGroupKey(storageKey: string) {
    return sluggify(`FILE_STORAGE__${storageKey}`).toUpperCase();
  }
}

const _currentStorageKeyValueStoreApiService =
  createKeyValueDomainPersistenceService<string>("current-storage");

export const storageApiService = new StorageApiService(
  _currentStorageKeyValueStoreApiService,
  credentialsApiService
);
