import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "../lib/config-persistence";
import { CONFIGURATION_KEYS } from "../../shared/configuration.constants";

export class ConfigurationService {
  constructor(
    private _appConfigPersistenceService: AbstractConfigDataPersistenceService<unknown>
  ) {}

  private checkConfigKeyEntityRequirement(
    key: keyof typeof CONFIGURATION_KEYS,
    entity?: string
  ) {
    if (CONFIGURATION_KEYS[key].requireEntity && !entity) {
      throw new Error(
        `Configuration '${key}' requires an entity to be passed in`
      );
    }
  }

  async show<T>(
    key: keyof typeof CONFIGURATION_KEYS,
    entity?: string
  ): Promise<T> {
    this.checkConfigKeyEntityRequirement(key, entity);
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
    this.checkConfigKeyEntityRequirement(key, entity);
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
