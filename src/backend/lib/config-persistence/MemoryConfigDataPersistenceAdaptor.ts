import { ConfigService } from "../config/config.service";
import { AbstractConfigDataPersistenceService } from "./AbstractConfigDataPersistenceService";
import { ConfigDomain } from "./types";

export class MemoryConfigDataPersistenceAdaptor<
  T
> extends AbstractConfigDataPersistenceService<T> {
  private data: Record<string, Record<string, T>> = {};

  constructor(configDomain: ConfigDomain, configService: ConfigService) {
    super(configDomain, configService);
  }

  private getDomainData() {
    if (!this.data[this.configDomain]) {
      this.data = { ...this.data, [this.configDomain]: {} };
    }
    return this.data[this.configDomain];
  }

  async resetToEmpty() {
    this.data[this.configDomain] = {};
  }

  private persistDomainData(data: Record<string, T>) {
    this.data[this.configDomain] = data;
  }

  async getAllItems() {
    return Object.values(this.getDomainData());
  }

  async getItem(key: string) {
    const currentItem = this.getDomainData()[key];
    if (currentItem) {
      return currentItem;
    }
    return undefined;
  }

  async upsertItem(key: string, data: T) {
    const domainData = this.getDomainData();
    domainData[key] = data;
    this.persistDomainData(domainData);
  }

  public async removeItem(key: string): Promise<void> {
    const domainData = this.getDomainData();

    delete domainData[key];

    this.persistDomainData(domainData);
  }

  async saveAllItems(keyField: keyof T, data: T[]) {
    this.persistDomainData(
      Object.fromEntries(data.map((datum) => [datum[keyField], datum]))
    );
  }
}
