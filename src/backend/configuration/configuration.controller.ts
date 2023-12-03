import { BadRequestError } from "backend/lib/errors";
import {
  APP_CONFIGURATION_CONFIG,
  AppConfigurationKeys,
} from "shared/configurations";
import {
  configurationApiService,
  ConfigurationApiService,
} from "./configuration.service";

export class ConfigurationApiController {
  constructor(private _configurationService: ConfigurationApiService) {}

  async showConfig(key: AppConfigurationKeys, entity?: string) {
    return await this._configurationService.show(key, entity);
  }

  async showGuestConfig(key: AppConfigurationKeys) {
    if (!APP_CONFIGURATION_CONFIG[key].guest) {
      throw new BadRequestError(`Invalid guest config key ${key}`);
    }
    return await this.showConfig(key);
  }

  async upsertConfig(
    key: AppConfigurationKeys,
    value: unknown,
    entity?: string
  ) {
    await this._configurationService.upsert(key, value, entity);
  }
}

export const configurationApiController = new ConfigurationApiController(
  configurationApiService
);
