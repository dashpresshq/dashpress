import { BadRequestError } from "backend/lib/errors";
import type { AppConfigurationKeys } from "shared/configurations";
import { APP_CONFIGURATION_CONFIG } from "shared/configurations";
import type { ConfigurationApiService } from "./configuration.service";
import { configurationApiService } from "./configuration.service";

export class ConfigurationApiController {
  constructor(private _configurationService: ConfigurationApiService) {}

  async showConfig(key: string, entity?: string) {
    const appConfigurationKey = this.validateAppConfigurationKeys({
      key,
      entity,
    });
    return await this._configurationService.show(appConfigurationKey, entity);
  }

  async showGuestConfig(key: string) {
    if (!APP_CONFIGURATION_CONFIG[key].guest) {
      throw new BadRequestError(`Invalid guest config key ${key}`);
    }
    return await this.showConfig(key);
  }

  async upsertConfig(key: string, value: unknown, entity?: string) {
    const appConfigurationKey = this.validateAppConfigurationKeys({
      key,
      entity,
    });
    await this._configurationService.upsert(appConfigurationKey, value, entity);
  }

  private validateAppConfigurationKeys({
    key,
    entity,
  }: {
    key: string;
    entity?: string;
  }) {
    const configBag = APP_CONFIGURATION_CONFIG[key];
    if (!configBag) {
      throw new BadRequestError(`Configuration key '${key}' doesn't exist`);
    }
    if (configBag.requireEntity && !entity) {
      throw new BadRequestError(
        `Configuration of key '${key}' requires entity`
      );
    }
    return key as AppConfigurationKeys;
  }
}

export const configurationApiController = new ConfigurationApiController(
  configurationApiService
);
