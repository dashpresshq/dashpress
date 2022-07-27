import fs from "fs-extra";
import path from "path";

import { AbstractConfigDataPersistenceService } from "./AbstractConfigDataPersistenceService";
import { ConfigDomain } from "./types";

const pathToConfigDomain = (type: ConfigDomain) => {
  const file =
    process.env.NODE_ENV === "test" ? `${type}.test.json` : `${type}.json`;
  return path.resolve(process.cwd(), ".config-data", file);
};

export class JsonFileConfigDataPersistenceAdaptor<
  T
> extends AbstractConfigDataPersistenceService<T> {
  async initialize() {}

  constructor(configDomain: ConfigDomain) {
    super(configDomain);
  }

  private async getAllIndexedItems(): Promise<Record<string, T>> {
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
    if (process.env.NODE_ENV === "test") {
      return;
    }
    await fs.writeJson(pathToConfigDomain(this.configDomain), data, {
      spaces: 2,
    });
  }

  async getAllItems() {
    const allIndexedItems = await this.getAllIndexedItems();
    return Object.values(allIndexedItems);
  }

  async getItem(key: string) {
    const allIndexedItems = await this.getAllIndexedItems();
    const currentItem = allIndexedItems[key];
    if (currentItem) {
      return currentItem;
    }
    return undefined;
  }

  async upsertItem(key: string, data: T) {
    const allIndexedItems = await this.getAllIndexedItems();
    allIndexedItems[key] = data;
    await this.persist(allIndexedItems);
  }

  async removeItem(key: string): Promise<void> {
    const allIndexedItems = await this.getAllIndexedItems();
    delete allIndexedItems[key];
    await this.persist(allIndexedItems);
  }

  async saveAllItems(keyField: keyof T, data: T[]) {
    await this.persist(
      Object.fromEntries(data.map((datum) => [datum[keyField], datum]))
    );
  }
}
