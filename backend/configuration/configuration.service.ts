import { CONFIGURATION_KEYS } from "../../shared/configuration.constants";

const LOCAL_CONFIG = {};

export class ConfigurationService {
  private async getConfiguration() {
    // TODO Sharing configuration at a central place
    // if (!process.env.CARDINAL_LICENSE) {
      return LOCAL_CONFIG;
    // }
    // return (await this.cardinalConfig()) as Record<string, unknown>;
  }

  private async persitentConfig(config: Record<string, unknown>) {
    // if (!process.env.CARDINAL_LICENSE) {
    //   return;
    // }
    // this.saveConfigSomeWhere();
  }

  async show(
    key: keyof typeof CONFIGURATION_KEYS,
    entity?: string
  ): Promise<unknown> {
    const config = await this.getConfiguration();
    const { requireEntity, defaultValue } = CONFIGURATION_KEYS[key];
    const value = requireEntity ? (config[key] || {})[entity] : config[key];
    return value || defaultValue;
  }

  async upsert(
    key: keyof typeof CONFIGURATION_KEYS,
    value: unknown,
    entity?: string
  ): Promise<void> {
    const config = await this.getConfiguration();

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
