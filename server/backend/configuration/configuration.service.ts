import { CONFIGURATION_KEYS } from "./configuration.constants";
export class ConfigurationService {

  async show(key: keyof typeof CONFIGURATION_KEYS, entity?: string): Promise<unknown> {
      return "";
  }

  async update(key: string, value: unknown, entity?: string): Promise<void> {

  }
}

export const configurationService = new ConfigurationService();
