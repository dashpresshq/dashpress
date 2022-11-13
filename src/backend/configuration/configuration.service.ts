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
} from "../../shared/configuration.constants";

export class ConfigurationService implements IApplicationService {
  constructor(
    private _appConfigPersistenceService: AbstractConfigDataPersistenceService<unknown>
  ) {}

  async bootstrap() {
    await this._appConfigPersistenceService.setup();
  }

  private checkConfigKeyEntityRequirement(
    key: keyof typeof CONFIGURATION_KEYS,
    entity?: string
  ) {
    progammingError(
      `Configuration '${key}' requires an entity to be passed in`,
      CONFIGURATION_KEYS[key].requireEntity && !entity
    );
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

  async getSystemSettings<T extends keyof ISystemSettings>(
    key: T
  ): Promise<ISystemSettings[T]> {
    const systemSettings = await this.show<ISystemSettings>("system_settings");
    return { ...DEFAULT_SYSTEM_SETTINGS, ...systemSettings }[key];
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
