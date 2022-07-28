import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "backend/lib/config-persistence";
import {
  EncryptionService,
  encryptionService,
} from "backend/lib/encryption/encryption.service";

export class CredentialsService {
  constructor(
    private _credentialsPersistenceService: AbstractConfigDataPersistenceService<
      Record<string, unknown>
    >,
    private _encryptionService: EncryptionService
  ) {}

  async upsertDomainCredentials(
    domain: string,
    credentials: Record<string, unknown>
  ) {
    const encryptedCredentials: [string, unknown][] = await Promise.all(
      Object.entries(credentials).map(async ([key, value]) => [
        key,
        typeof value === "string"
          ? await this._encryptionService.encrypt(value)
          : value,
      ])
    );
    await this._credentialsPersistenceService.upsertItem(
      domain,
      Object.fromEntries(encryptedCredentials)
    );
  }

  async removeDomainCredentials(domain: string) {
    await this._credentialsPersistenceService.removeItem(domain);
  }

  async getDomainCredentials<T extends Record<string, unknown>>(
    domain: string
  ): Promise<T> {
    const credentials = await this._credentialsPersistenceService.getItem(
      domain
    );
    if (!credentials) {
      return {} as T;
    }

    const decryptedCredentials: [string, unknown][] = await Promise.all(
      Object.entries(credentials).map(async ([key, value]) => [
        key,
        typeof value === "string"
          ? await this._encryptionService.decrypt(value)
          : value,
      ])
    );

    return Object.fromEntries(decryptedCredentials) as T;
  }
}

const credentialsPersistenceService =
  createConfigDomainPersistenceService<Record<string, unknown>>("credentials");

export const credentialsService = new CredentialsService(
  credentialsPersistenceService,
  encryptionService
);
