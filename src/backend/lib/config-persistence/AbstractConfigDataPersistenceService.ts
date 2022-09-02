import { ConfigService } from "../config/config.service";
import { ConfigDomain } from "./types";

export abstract class AbstractConfigDataPersistenceService<T> {
  protected readonly configDomain!: ConfigDomain;

  protected readonly configService!: ConfigService;

  constructor(configDomain: ConfigDomain, configService: ConfigService) {
    this.configDomain = configDomain;
    this.configService = configService;
  }

  private mergeKeyWithSecondaryKey(key: string, secondaryKey: string) {
    return `${key}__${secondaryKey}`;
  }

  public abstract getItem(key: string): Promise<T | undefined>;

  public async getItemWithMaybeSecondaryKey(
    key: string,
    secondaryKey?: string
  ): Promise<T | undefined> {
    if (!secondaryKey) {
      return await this.getItem(key);
    }
    return await this.getItem(this.mergeKeyWithSecondaryKey(key, secondaryKey));
  }

  public abstract getAllItems(): Promise<T[]>;

  public abstract upsertItem(key: string, data: T): Promise<void>;

  public async upsertItemWithMaybeSecondaryKey(
    key: string,
    value: T,
    secondaryKey?: string
  ): Promise<void> {
    if (!secondaryKey) {
      return await this.upsertItem(key, value);
    }
    return await this.upsertItem(
      this.mergeKeyWithSecondaryKey(key, secondaryKey),
      value
    );
  }

  public abstract removeItem(key: string): Promise<void>;

  public async resetState(keyField: keyof T, data: T[]) {
    await this.resetToEmpty();
    await this.saveAllItems(keyField, data);
  }

  protected abstract saveAllItems(keyField: keyof T, data: T[]): Promise<void>;

  public abstract resetToEmpty(): Promise<void>;
}
