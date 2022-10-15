import { AbstractConfigDataPersistenceService } from "backend/lib/config-persistence";
import { EncryptionService } from "backend/lib/encryption/encryption.service";
import { ForbiddenError } from "backend/lib/errors";
import { IApplicationService } from "backend/types";
import noop from "lodash/noop";

export abstract class BaseApplicationConfigs implements IApplicationService {
  constructor(
    private _credentialsPersistenceService: AbstractConfigDataPersistenceService<string>,
    private _encryptionService: EncryptionService
  ) {}

  async bootstrap() {
    try {
      await this._credentialsPersistenceService.setup();
    } catch (error) {
      noop();
    }
  }

  async hasKey(key: string): Promise<boolean> {
    try {
      await this.getValue(key);
      return true;
    } catch {
      return false;
    }
  }

  async getValue(key: string): Promise<string> {
    const credentials = await this._credentialsPersistenceService.getItem(key);

    if (!credentials) {
      throw new ForbiddenError(`No credentials available for ${key}`);
    }

    const decryptedCredentials: [string, unknown][] = await Promise.all(
      Object.entries(credentials).map(async ([key$1, value]) => [
        key$1,
        JSON.parse(await this._encryptionService.decrypt(value as string)),
      ])
    );

    return Object.fromEntries(decryptedCredentials) as T;
  }

  async list() {}

  async upsertGroup() {}

  async getGroup() {}

  async upsert(key: string, value: string) {
    const encryptedCredentials: [string, unknown][] = await Promise.all(
      Object.entries(value).map(async ([key$1, value$1]) => [
        key$1,
        await this._encryptionService.encrypt(JSON.stringify(value$1)),
      ])
    );
    await this._credentialsPersistenceService.upsertItem(
      key,
      Object.fromEntries(encryptedCredentials)
    );
  }
}
