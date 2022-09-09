import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "backend/lib/config-persistence";
import {
  EncryptionService,
  encryptionService,
} from "backend/lib/encryption/encryption.service";
import { ForbiddenError } from "backend/lib/errors";
import { IApplicationService } from "backend/types";

export class CredentialsService implements IApplicationService {
  constructor(
    private _credentialsPersistenceService: AbstractConfigDataPersistenceService<
      Record<string, unknown>
    >,
    private _encryptionService: EncryptionService
  ) {}

  async bootstrap() {
    await this._credentialsPersistenceService.setup();
  }

  async hasDomainCredentials(domain: string): Promise<boolean> {
    try {
      await this.getDomainCredentials(domain);
      return true;
    } catch {
      return false;
    }
  }

  async upsertDomainCredentials(
    domain: string,
    credentials: Record<string, unknown>
  ) {
    const encryptedCredentials: [string, unknown][] = await Promise.all(
      Object.entries(credentials).map(async ([key, value]) => [
        key,
        await this._encryptionService.encrypt(JSON.stringify(value)),
      ])
    );
    await this._credentialsPersistenceService.upsertItem(
      domain,
      Object.fromEntries(encryptedCredentials)
    );
  }

  async getDomainCredentials<T extends Record<string, unknown>>(
    domain: string
  ): Promise<T> {
    const credentials = await this._credentialsPersistenceService.getItem(
      domain
    );
    if (!credentials) {
      throw new ForbiddenError(`No credentials available for ${domain}`);
    }

    const decryptedCredentials: [string, unknown][] = await Promise.all(
      Object.entries(credentials).map(async ([key, value]) => [
        key,
        JSON.parse(await this._encryptionService.decrypt(value as string)),
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
