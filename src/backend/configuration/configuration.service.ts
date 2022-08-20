import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "../lib/config-persistence";
import { CONFIGURATION_KEYS } from "../../shared/configuration.constants";

export class ConfigurationService {
  constructor(
    private _appConfigPersistenceService: AbstractConfigDataPersistenceService<unknown>
  ) {}

  async show<T>(
    key: keyof typeof CONFIGURATION_KEYS,
    entity?: string
  ): Promise<T> {
    const value =
      await this._appConfigPersistenceService.getItemWithMaybeSecondaryKey(
        key,
        entity
      );

    if (value) {
      return value as T;
    }

    return CONFIGURATION_KEYS[key].defaultValue as T;
  }

  async upsert(
    key: keyof typeof CONFIGURATION_KEYS,
    value: unknown,
    entity?: string
  ): Promise<void> {
    await this._appConfigPersistenceService.upsertItemWithMaybeSecondaryKey(
      key,
      value,
      entity
    );
  }
}

const appConfigPersistenceService =
  createConfigDomainPersistenceService("app-config");

export const configurationService = new ConfigurationService(
  appConfigPersistenceService
);
