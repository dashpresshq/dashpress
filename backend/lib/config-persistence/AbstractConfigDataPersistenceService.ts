import { ConfigService } from "../config/config.service";
import { ConfigDomain } from "./types";

export abstract class AbstractConfigDataPersistenceService<T> {
  protected readonly configDomain!: ConfigDomain;

  protected readonly configService!: ConfigService;

  // constructor(configDomain: ConfigDomain, configService: ConfigService) {
  //   this.configDomain = configDomain;
  //   this.configService = configService;
  // }

  public abstract setup(): Promise<void>;

  // Might need to introduce second key
  public abstract getItem(key: string): Promise<T | undefined>;

  public abstract getAllItems(): Promise<T[]>;

  // Might need to introduce second key
  public abstract upsertItem(key: string, data: T): Promise<void>;

  public abstract removeItem(key: string): Promise<void>;

  public abstract saveAllItems(keyField: keyof T, data: T[]): Promise<void>;
}
