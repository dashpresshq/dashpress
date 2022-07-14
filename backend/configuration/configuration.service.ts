import { ConfigData } from "../lib/config-data";
import { CONFIGURATION_KEYS } from "../../shared/configuration.constants";

export class ConfigurationService {
  static _config: Record<string, unknown> | undefined;

  static async getConfig() {
    if (this._config) {
      return this._config;
    }
    return await ConfigData.get("app-config", {});
  }

  async show<T>(
    key: keyof typeof CONFIGURATION_KEYS,
    entity?: string
  ): Promise<T> {
    const config = await ConfigurationService.getConfig();
    const { requireEntity, defaultValue } = CONFIGURATION_KEYS[key];
    if (requireEntity && !entity) {
      throw new Error(`${key} requires entity to be passed`);
    }
    const value = requireEntity ? (config[key] || {})[entity] : config[key];
    return value || defaultValue;
  }

  async upsert(
    key: keyof typeof CONFIGURATION_KEYS,
    value: unknown,
    entity?: string
  ): Promise<void> {
    const config = await ConfigurationService.getConfig();

    const { requireEntity } = CONFIGURATION_KEYS[key];
    if (requireEntity) {
      if (!config[key]) {
        config[key] = {};
      }
      config[key][entity] = value;
    } else {
      config[key] = value;
    }

    await ConfigData.put("app-config", config);
  }
}

export const configurationService = new ConfigurationService();
