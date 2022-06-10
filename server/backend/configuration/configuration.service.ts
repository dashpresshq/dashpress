import { CONFIGURATION_KEYS } from "./configuration.constants";

const CONFIG = {};

export class ConfigurationService {
  async show(
    key: keyof typeof CONFIGURATION_KEYS,
    entity?: string
  ): Promise<unknown> {
    // Sharing configuration at a central place
    const { requireEntity, defaultValue } = CONFIGURATION_KEYS[key];
    const value = requireEntity ? (CONFIG[key] || {})[entity] : CONFIG[key];
    return value || defaultValue;
  }

  async upsert(
    key: keyof typeof CONFIGURATION_KEYS,
    value: unknown,
    entity?: string
  ): Promise<void> {
    const { requireEntity } = CONFIGURATION_KEYS[key];
    if (requireEntity) {
      if (!CONFIG[key]) {
        CONFIG[key] = {};
      }
      CONFIG[key][entity] = value;
    } else {
      CONFIG[key] = value;
    }
  }
}

export const configurationService = new ConfigurationService();
