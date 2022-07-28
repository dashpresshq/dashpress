import { ConfigDomain } from "./types";

export abstract class AbstractConfigDataPersistenceService<T> {
  protected readonly configDomain: ConfigDomain;

  constructor(configDomain: ConfigDomain) {
    this.configDomain = configDomain;
  }

  public abstract initialize(): Promise<void>;

  // Might need to introduce second key
  public abstract getItem(key: string): Promise<T | undefined>;

  public abstract getAllItems(): Promise<T[]>;

  // Might need to introduce second key
  public abstract upsertItem(key: string, data: T): Promise<void>;

  public abstract removeItem(key: string): Promise<void>;

  public abstract saveAllItems(keyField: keyof T, data: T[]): Promise<void>;
}
