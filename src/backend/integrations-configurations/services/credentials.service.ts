import {
  AbstractConfigDataPersistenceService,
  createConfigDomainPersistenceService,
} from "backend/lib/config-persistence";
import {
  encryptionService,
  EncryptionService,
} from "backend/lib/encryption/encryption.service";
import { IntegrationsConfigurationService } from "./_base";

export class CredentialsService extends IntegrationsConfigurationService {
  constructor(
    _credentialsPersistenceService: AbstractConfigDataPersistenceService<string>,
    _encryptionService: EncryptionService
  ) {
    super(_credentialsPersistenceService, _encryptionService);
  }

  async processDataToSave(data: string) {
    return await this._encryptionService.encrypt(JSON.stringify(data));
  }

  async processDataAfterFetch(data: string) {
    return JSON.parse(await this._encryptionService.decrypt(data));
  }
}

export const credentialsService = new CredentialsService(
  createConfigDomainPersistenceService<string>("credentials"),
  encryptionService
);
