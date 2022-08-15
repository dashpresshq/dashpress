import { ConfigService } from "../config/config.service";

export abstract class AbstractCacheService {
  protected readonly prefix!: string;

  protected readonly configService!: ConfigService;

  constructor(prefix: string, configService: ConfigService) {
    this.prefix = prefix;
    this.configService = configService;
  }

  public abstract getItem<T>(
    key: string,
    fetcher: () => Promise<T>
  ): Promise<T | undefined>;

  public abstract clearItem(key: string): Promise<void>;
}
