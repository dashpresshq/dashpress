import {
  credentialsService,
  CredentialsService,
} from "backend/integrations-configurations";
import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "backend/lib/config-persistence";
import { validateSchemaRequestBody } from "backend/lib/errors/validate-schema-request-input";
import { IApplicationService } from "backend/types";
import { IIntegrationsList } from "shared/types/actions";
import { STORAGE_INTEGRATIONS } from "./integrations";

interface IActivatedStorage {
  key: string;
}

export class StorageService implements IApplicationService {
  constructor(
    private readonly _activatedStoragePersistenceService: AbstractConfigDataPersistenceService<IActivatedStorage>,
    private readonly _credentialsService: CredentialsService
  ) {}

  async bootstrap() {
    await this._activatedStoragePersistenceService.setup();
  }

  listStorageIntegrations(): IIntegrationsList[] {
    return Object.entries(STORAGE_INTEGRATIONS).map(
      ([key, { title, configurationSchema }]) => ({
        title,
        key,
        description: `Store uploaded files to ${title}`,
        configurationSchema,
      })
    );
  }

  async listActivatedStorage(): Promise<string[]> {
    const activatedStorage =
      await this._activatedStoragePersistenceService.getAllItems();
    return activatedStorage.map(({ key }) => key);
  }

  async activateStorage(
    storageKey: string,
    configuration: Record<string, string>
  ): Promise<void> {
    validateSchemaRequestBody(
      STORAGE_INTEGRATIONS[storageKey].configurationSchema,
      configuration
    );

    await this._activatedStoragePersistenceService.upsertItem(storageKey, {
      key: storageKey,
    });

    await this._credentialsService.upsertGroup(
      {
        key: STORAGE_INTEGRATIONS[storageKey].credentialsGroupKey,
        fields: Object.keys(
          STORAGE_INTEGRATIONS[storageKey].configurationSchema
        ),
      },
      configuration
    );
  }

  async showStorageConfig(
    storageKey: string
  ): Promise<Record<string, unknown>> {
    return await this._credentialsService.useGroupValue({
      key: STORAGE_INTEGRATIONS[storageKey].credentialsGroupKey,
      fields: Object.keys(STORAGE_INTEGRATIONS[storageKey].configurationSchema),
    });
  }

  async updateStorageConfig(
    storageKey: string,
    configuration: Record<string, string>
  ): Promise<void> {
    validateSchemaRequestBody(
      STORAGE_INTEGRATIONS[storageKey].configurationSchema,
      configuration
    );

    await this._credentialsService.upsertGroup(
      {
        key: STORAGE_INTEGRATIONS[storageKey].credentialsGroupKey,
        fields: Object.keys(
          STORAGE_INTEGRATIONS[storageKey].configurationSchema
        ),
      },
      configuration
    );
  }

  async deactivateStorage(storageKey: string): Promise<void> {
    await this._credentialsService.deleteGroup({
      key: STORAGE_INTEGRATIONS[storageKey].credentialsGroupKey,
      fields: Object.keys(STORAGE_INTEGRATIONS[storageKey].configurationSchema),
    });

    await this._activatedStoragePersistenceService.removeItem(storageKey);
  }
}

const activatedStoragePersistenceService =
  createConfigDomainPersistenceService<IActivatedStorage>("activated_storage");

export const storageService = new StorageService(
  activatedStoragePersistenceService,
  credentialsService
);
