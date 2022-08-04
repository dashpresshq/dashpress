import fs from "fs-extra";
import path from "path";
import { configService, NodeEnvironments } from "../config/config.service";

import { AbstractConfigDataPersistenceService } from "./AbstractConfigDataPersistenceService";
import { ConfigDomain } from "./types";

const pathToConfigDomain = (type: ConfigDomain) => {
  const file =
    configService.getNodeEnvironment() === NodeEnvironments.Test
      ? `${type}.test.json`
      : `${type}.json`;
  return path.resolve(process.cwd(), ".config-data", file);
};

export class JsonFileConfigDataPersistenceAdaptor<
  T
> extends AbstractConfigDataPersistenceService<T> {
  async initialize() {}

  constructor(configDomain: ConfigDomain) {
    super(configDomain);
  }

  private async getDomainData(): Promise<Record<string, T>> {
    try {
      return (
        (await fs.readJson(pathToConfigDomain(this.configDomain), {
          throws: false,
        })) || {}
      );
    } catch (error) {
      return {};
    }
  }

  private async persist(data: Record<string, T>) {
    if (configService.getNodeEnvironment() === NodeEnvironments.Test) {
      return;
    }
    await fs.writeJson(pathToConfigDomain(this.configDomain), data, {
      spaces: 2,
    });
  }

  async getAllItems() {
    const allIndexedItems = await this.getDomainData();
    return Object.values(allIndexedItems);
  }

  async getItem(key: string) {
    const allIndexedItems = await this.getDomainData();
    const currentItem = allIndexedItems[key];
    if (currentItem) {
      return currentItem;
    }
    return undefined;
  }

  async upsertItem(key: string, data: T) {
    const allIndexedItems = await this.getDomainData();
    allIndexedItems[key] = data;
    await this.persist(allIndexedItems);
  }

  async removeItem(key: string): Promise<void> {
    const allIndexedItems = await this.getDomainData();
    delete allIndexedItems[key];
    await this.persist(allIndexedItems);
  }

  async saveAllItems(keyField: keyof T, data: T[]) {
    await this.persist(
      Object.fromEntries(data.map((datum) => [datum[keyField], datum]))
    );
  }
}
