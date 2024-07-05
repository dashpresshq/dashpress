import { progammingError } from "backend/lib/errors";
import type { AppConfigurationValueType } from "shared/configurations/constants";
import { notAllowedOnDemoValidation } from "backend/lib/request/validations/implementations/not-allowed-on-demo";
import type { AbstractConfigDataPersistenceService } from "../lib/config-persistence";
import { createConfigDomainPersistenceService } from "../lib/config-persistence";
import type {
  ISystemSettings,
  AppConfigurationKeys,
} from "../../shared/configurations";
import {
  APP_CONFIGURATION_CONFIG,
  DEFAULT_SYSTEM_SETTINGS,
} from "../../shared/configurations";

export class ConfigurationApiService {
  constructor(
    private _appConfigPersistenceService: AbstractConfigDataPersistenceService<unknown>
  ) {}

  async show<T extends AppConfigurationKeys>(
    key: T,
    entity?: string
  ): Promise<AppConfigurationValueType<T>> {
    this.checkConfigKeyEntityRequirement(key, entity);

    return (await this._appConfigPersistenceService.getItem(
      this._appConfigPersistenceService.mergeKeyWithSecondaryKey(key, entity),
      APP_CONFIGURATION_CONFIG[key].defaultValue
    )) as AppConfigurationValueType<T>;
  }

  async getSystemSettings<T extends keyof ISystemSettings>(
    key: T
  ): Promise<ISystemSettings[T]> {
    const systemSettings = await this.show("system_settings");
    return { ...DEFAULT_SYSTEM_SETTINGS, ...systemSettings }[key];
  }

  async upsert<T extends AppConfigurationKeys>(
    key: T,
    value: unknown,
    entity?: string
  ): Promise<void> {
    this.checkConfigKeyEntityRequirement(key, entity);

    const disabledConfigKeysOnDemo: AppConfigurationKeys[] = [
      "disabled_entities",
    ];

    if (disabledConfigKeysOnDemo.includes(key)) {
      notAllowedOnDemoValidation();
    }

    return await this._appConfigPersistenceService.upsertItem(
      this._appConfigPersistenceService.mergeKeyWithSecondaryKey(key, entity),
      value
    );
  }

  private checkConfigKeyEntityRequirement(
    key: AppConfigurationKeys,
    entity?: string
  ) {
    const config = APP_CONFIGURATION_CONFIG[key];
    if ("requireEntity" in config) {
      progammingError(
        `Configuration '${key}' requires an entity to be passed in`,
        config.requireEntity && !entity
      );
    }
  }
}

const appConfigPersistenceService =
  createConfigDomainPersistenceService("app-config");

export const configurationApiService = new ConfigurationApiService(
  appConfigPersistenceService
);
