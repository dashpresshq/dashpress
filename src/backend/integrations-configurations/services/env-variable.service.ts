import {
  AbstractConfigDataPersistenceService,
  createConfigDomainPersistenceService,
} from "backend/lib/config-persistence";
import {
  encryptionService,
  EncryptionService,
} from "backend/lib/encryption/encryption.service";
import { IntegrationsConfigurationService } from "./_base";

class PlainConfigurationService extends IntegrationsConfigurationService {
  constructor(
    _credentialsPersistenceService: AbstractConfigDataPersistenceService<string>,
    _encryptionService: EncryptionService
  ) {
    super(_credentialsPersistenceService, _encryptionService);
  }
}

export const environmentVariablesService = new PlainConfigurationService(
  createConfigDomainPersistenceService<string>("environment-variables"),
  encryptionService
);

export const appConstantsService = new PlainConfigurationService(
  createConfigDomainPersistenceService<string>("constants"),
  encryptionService
);
