import Cryptr from "cryptr";
import {
  ConfigKeys,
  configService,
  ConfigService,
} from "../config/config.service";

export class EncryptionService {
  private encyptionInstance: Cryptr;

  constructor(private readonly _configService: ConfigService) {
    this.encyptionInstance = new Cryptr(
      this._configService.getConfigValue(ConfigKeys.CREDENTIALS_ENCRYPTION_KEY)
    );
  }

  async encrypt(text: string): Promise<string> {
    return this.encyptionInstance.encrypt(text);
  }

  async decrypt(text: string): Promise<string> {
    return this.encyptionInstance.decrypt(text);
  }
}

export const encryptionService = new EncryptionService(configService);
