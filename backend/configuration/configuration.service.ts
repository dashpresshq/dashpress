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
    const config = await this._appConfigPersistenceService.getItem(key);

    const { requireEntity, defaultValue } = CONFIGURATION_KEYS[key];
    const value = requireEntity ? (config || {})[entity] : config;
    return value || defaultValue;
  }

  async upsert(
    key: keyof typeof CONFIGURATION_KEYS,
    value: unknown,
    entity?: string
  ): Promise<void> {
    let config = await this._appConfigPersistenceService.getItem(key);

    const { requireEntity } = CONFIGURATION_KEYS[key];

    if (requireEntity) {
      if (!config) {
        config = {};
      }
      config[entity] = value;
    } else {
      config = value;
    }
    await this._appConfigPersistenceService.upsertItem(key, config);
  }
}

const appConfigPersistenceService =
  createConfigDomainPersistenceService("app-config");

export const configurationService = new ConfigurationService(
  appConfigPersistenceService
);
