import type { AbstractConfigDataPersistenceService } from "backend/lib/config-persistence";
import { createConfigDomainPersistenceService } from "backend/lib/config-persistence";
import type { EncryptionApiService } from "backend/lib/encryption/encryption.service";
import { encryptionApiService } from "backend/lib/encryption/encryption.service";

import { IntegrationsConfigurationApiService } from "./_base";

export class CredentialsApiService extends IntegrationsConfigurationApiService {
  constructor(
    _credentialsPersistenceService: AbstractConfigDataPersistenceService<string>,
    _encryptionApiService: EncryptionApiService
  ) {
    super(_credentialsPersistenceService, _encryptionApiService);
  }

  async processDataToSave(data: string) {
    return await this._encryptionApiService.encrypt(JSON.stringify(data));
  }

  async processDataAfterFetch(data: string) {
    return JSON.parse(await this._encryptionApiService.decrypt(data));
  }
}

export const credentialsApiService = new CredentialsApiService(
  createConfigDomainPersistenceService<string>("credentials"),
  encryptionApiService
);
