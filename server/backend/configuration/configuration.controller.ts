import { CONFIGURATION_KEYS } from "./configuration.constants";
import {
  configurationService,
  ConfigurationService,
} from "./configuration.service";

export class ConfigurationController {
  constructor(private configurationService: ConfigurationService) {}
      
 async showConfig(key: string, entity?: string) {
    const configurationKey = this.validateConfig(key, entity);

    return await this.configurationService.show(configurationKey, entity);
  }

  async upsertConfig(key: string, value: unknown, entity?: string) {
   const configurationKey = this.validateConfig(key, entity);

    await this.configurationService.upsert(configurationKey, value, entity);
  }

  private validateConfig(key: string, entity?: string): keyof typeof CONFIGURATION_KEYS {
    const configBag = CONFIGURATION_KEYS[key];
    if (!configBag) {
      throw new Error(`Configuration doesn't key '${key}' doesn't exist`);
    }
    if (configBag.requireEntity && !entity) {
       throw new Error(`Configuration of key '${key}' requires entity`);
    }
    return key as keyof typeof CONFIGURATION_KEYS;
  }
}

export const configurationController = new ConfigurationController(
  configurationService
);
