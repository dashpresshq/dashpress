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
    _credentialsPersistenceService: AbstractConfigDataPersistenceService<
      Record<string, unknown>
    >,
    _encryptionService: EncryptionService
  ) {
    super(_credentialsPersistenceService, _encryptionService);
  }
}

export const credentialsService = new CredentialsService(
  createConfigDomainPersistenceService<Record<string, unknown>>("credentials"),
  encryptionService
);

export const constantsService = new CredentialsService(
  createConfigDomainPersistenceService<Record<string, unknown>>("constants"),
  encryptionService
);

export const environmentVariablesService = new CredentialsService(
  createConfigDomainPersistenceService<Record<string, unknown>>(
    "environment-variables"
  ),
  encryptionService
);
