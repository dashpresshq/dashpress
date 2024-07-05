import Cryptr from "cryptr";
import type { ConfigApiService } from "../config/config.service";
import { ConfigKeys, configApiService } from "../config/config.service";

export class EncryptionApiService {
  private encyptionInstance: Cryptr;

  constructor(private readonly _configApiService: ConfigApiService) {
    this.encyptionInstance = new Cryptr(
      this._configApiService.getConfigValue(
        ConfigKeys.CREDENTIALS_ENCRYPTION_KEY
      )
    );
  }

  async encrypt(text: string): Promise<string> {
    return this.encyptionInstance.encrypt(text);
  }

  async decrypt(text: string): Promise<string> {
    return this.encyptionInstance.decrypt(text);
  }
}

export const encryptionApiService = new EncryptionApiService(configApiService);
