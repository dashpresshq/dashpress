import { AbstractConfigDataPersistenceService } from "./AbstractConfigDataPersistenceService";
import { ConfigDomain } from "./types";

export class MemoryConfigDataPersistenceAdaptor<
  T
> extends AbstractConfigDataPersistenceService<T> {
  private data: Record<string, T> = {};

  async initialize() {}

  constructor(configDomain: ConfigDomain) {
    super(configDomain);
  }

  async getAllItems() {
    return Object.values(this.data);
  }

  async getItem(key: string) {
    const currentItem = this.data[key];
    if (currentItem) {
      return currentItem;
    }
    return undefined;
  }

  async upsertItem(key: string, data: T) {
    this.data[key] = data;
  }

  public async removeItem(key: string): Promise<void> {
    delete this.data[key];
  }

  async saveAllItems(keyField: keyof T, data: T[]) {
    this.data = Object.fromEntries(
      data.map((datum) => [datum[keyField], datum])
    );
  }
}
