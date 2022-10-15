import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "backend/lib/config-persistence";
import {
  EncryptionService,
  encryptionService,
} from "backend/lib/encryption/encryption.service";
import { BaseApplicationConfigs } from "./_base.service";

export class CredentialsService extends BaseApplicationConfigs {
  constructor(
    _credentialsPersistenceService: AbstractConfigDataPersistenceService<string>,
    _encryptionService: EncryptionService
  ) {
    super(_credentialsPersistenceService, _encryptionService);
  }
}

export const credentialsService = new CredentialsService(
  createConfigDomainPersistenceService<string>("credentials"),
  encryptionService
);

export const constantsService = new CredentialsService(
  createConfigDomainPersistenceService<string>("constants"),
  encryptionService
);

export const environmentVariablesService = new CredentialsService(
  createConfigDomainPersistenceService<string>("environment-variables"),
  encryptionService
);
