import fs from "fs-extra";
import noop from "lodash/noop";
import path from "path";
import { ConfigApiService } from "../config/config.service";

import { AbstractConfigDataPersistenceService } from "./AbstractConfigDataPersistenceService";
import { ConfigDomain } from "./types";

export class JsonFileConfigDataPersistenceAdaptor<
  T
> extends AbstractConfigDataPersistenceService<T> {
  constructor(configDomain: ConfigDomain, configApiService: ConfigApiService) {
    super(configDomain, configApiService);
  }

  async setup() {
    noop();
  }

  private pathToConfigDomain = (type: ConfigDomain) => {
    const file =
      this._configApiService.getNodeEnvironment() === "test"
        ? `${type}.test.json`
        : `${type}.json`;
    return path.resolve(
      process.env.CURRENT_WORKING_DIRECTORY || process.cwd(),
      ".config-data",
      file
    );
  };

  async resetToEmpty() {
    fs.removeSync(this.pathToConfigDomain(this._configDomain));
  }

  getItemLastUpdated() {
    return null;
  }

  private async getDomainData(): Promise<Record<string, T>> {
    try {
      return (
        (await fs.readJson(this.pathToConfigDomain(this._configDomain), {
          throws: false,
        })) || {}
      );
    } catch (error) {
      return {};
    }
  }

  private async persist(data: Record<string, T>) {
    await fs.outputJSON(this.pathToConfigDomain(this._configDomain), data, {
      spaces: 2,
    });
  }

  async getAllAsKeyValuePair() {
    return await this.getDomainData();
  }

  async getAllItems() {
    return Object.values(await this.getAllAsKeyValuePair());
  }

  async getAllItemsIn(itemIds: string[]) {
    const allIndexedItems = await this.getDomainData();

    return itemIds.map((itemId) => allIndexedItems[itemId]);
  }

  async getItem(key: string) {
    const allIndexedItems = await this.getDomainData();
    const currentItem = allIndexedItems[key];
    if (currentItem) {
      return currentItem;
    }
    return undefined;
  }

  async persistItem(key: string, data: T) {
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
