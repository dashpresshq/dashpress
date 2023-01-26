import { BadRequestError } from "backend/lib/errors";
import {
  CONFIGURATION_KEYS,
  AppConfigurationKeys,
} from "shared/configurations";
import {
  configurationService,
  ConfigurationService,
} from "./configuration.service";

export class ConfigurationController {
  constructor(private _configurationService: ConfigurationService) {}

  async showConfig(key: AppConfigurationKeys, entity?: string) {
    return await this._configurationService.show(key, entity);
  }

  async showGuestConfig(key: AppConfigurationKeys) {
    if (!CONFIGURATION_KEYS[key].guest) {
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

export const configurationController = new ConfigurationController(
  configurationService
);
