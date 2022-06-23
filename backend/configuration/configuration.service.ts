import { CONFIGURATION_KEYS } from "../../shared/configuration.constants";
import fs from "fs-extra";
import path from "path";

const pathToConfigFile = path.resolve(require("os").homedir(), "cardinal.json");

const DEFAULT_CONFIG = {};

export class ConfigurationService {
  static _config: Record<string, unknown> = null;

  static async getConfig() {
    if (!this._config) {
      ``;
      try {
        // TODO allow external config like redis/ db, etc
        this._config =
          (await fs.readJson(pathToConfigFile, { throws: false })) ||
          DEFAULT_CONFIG;
      } catch (error) {
        this._config = DEFAULT_CONFIG;
      }
    }
    return this._config;
  }

  private async persitentConfig(config: Record<string, unknown>) {
    await fs.writeJson(pathToConfigFile, config, { spaces: 2 });
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
    await this.persitentConfig(config);
  }
}

export const configurationService = new ConfigurationService();
