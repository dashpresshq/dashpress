import noop from "lodash/noop";
import { ConfigService } from "../config/config.service";
import { AbstractConfigDataPersistenceService } from "./AbstractConfigDataPersistenceService";
import { ConfigDomain } from "./types";

export class MemoryConfigDataPersistenceAdaptor<
  T
> extends AbstractConfigDataPersistenceService<T> {
  private static data: Record<string, Record<string, any>> = {};

  constructor(configDomain: ConfigDomain, configService: ConfigService) {
    super(configDomain, configService);
  }

  async setup() {
    noop();
  }

  static getDomainData(configDomain: ConfigDomain) {
    if (!MemoryConfigDataPersistenceAdaptor.data[configDomain]) {
      MemoryConfigDataPersistenceAdaptor.data = {
        ...MemoryConfigDataPersistenceAdaptor.data,
        [configDomain]: {},
      };
    }
    return MemoryConfigDataPersistenceAdaptor.data[configDomain];
  }

  async resetToEmpty() {
    MemoryConfigDataPersistenceAdaptor.data[this.configDomain] = {};
  }

  private persistDomainData(data: Record<string, T>) {
    MemoryConfigDataPersistenceAdaptor.data[this.configDomain] = data;
  }

  async getAllAsKeyValuePair() {
    return MemoryConfigDataPersistenceAdaptor.getDomainData(this.configDomain);
  }

  async getAllItems() {
    return Object.values(await this.getAllAsKeyValuePair());
  }

  async getAllItemsIn(itemIds: string[]) {
    const allItems = MemoryConfigDataPersistenceAdaptor.getDomainData(
      this.configDomain
    );

    return itemIds.map((itemId) => allItems[itemId]);
  }

  async getItem(key: string) {
    const currentItem = MemoryConfigDataPersistenceAdaptor.getDomainData(
      this.configDomain
    )[key];
    if (currentItem) {
      return currentItem;
    }
    return undefined;
  }

  async upsertItem(key: string, data: T) {
    const domainData = MemoryConfigDataPersistenceAdaptor.getDomainData(
      this.configDomain
    );
    domainData[key] = data;
    this.persistDomainData(domainData);
  }

  public async removeItem(key: string): Promise<void> {
    const domainData = MemoryConfigDataPersistenceAdaptor.getDomainData(
      this.configDomain
    );

    delete domainData[key];

    this.persistDomainData(domainData);
  }

  async saveAllItems(keyField: keyof T, data: T[]) {
    this.persistDomainData(
      Object.fromEntries(data.map((datum) => [datum[keyField], datum]))
    );
  }
}
