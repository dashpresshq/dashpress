import { IApplicationService } from "backend/types";
import { progammingError } from "backend/lib/errors";
import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "../lib/config-persistence";
import {
  CONFIGURATION_KEYS,
  DEFAULT_SYSTEM_SETTINGS,
  ISystemSettings,
  AppConfigurationKeys,
} from "../../shared/configurations";

export class ConfigurationApiService implements IApplicationService {
  constructor(
    private _appConfigPersistenceService: AbstractConfigDataPersistenceService<unknown>
  ) {}

  async bootstrap() {
    await this._appConfigPersistenceService.setup();
  }

  private checkConfigKeyEntityRequirement(
    key: AppConfigurationKeys,
    entity?: string
  ) {
    progammingError(
      `Configuration '${key}' requires an entity to be passed in`,
      CONFIGURATION_KEYS[key].requireEntity && !entity
    );
  }

  async show<T>(key: AppConfigurationKeys, entity?: string): Promise<T> {
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

  async getSystemSettings<T extends keyof ISystemSettings>(
    key: T
  ): Promise<ISystemSettings[T]> {
    const systemSettings = await this.show<ISystemSettings>("system_settings");
    return { ...DEFAULT_SYSTEM_SETTINGS, ...systemSettings }[key];
  }

  async upsert(
    key: AppConfigurationKeys,
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

export const configurationApiService = new ConfigurationApiService(
  appConfigPersistenceService
);
