import { Crypter, DecryptionError, EncryptionError } from "async-crypter";
import { BadRequestError } from "../errors";

export class EncryptionService {
  private encyptionInstance: Crypter;

  constructor() {
    this.encyptionInstance = new Crypter(process.env.ENCRYPTION_KEY);
  }

  async encrypt(text: string): Promise<string> {
    const result = await this.encyptionInstance.encrypt(Buffer.from(text));
    if (result instanceof EncryptionError) {
      throw new BadRequestError();
    }
    return result.toString();
  }

  async decrypt(text: string): Promise<string> {
    const result = await this.encyptionInstance.decrypt(Buffer.from(text));
    if (result instanceof DecryptionError) {
      throw new BadRequestError();
    }
    return result.toString();
  }
}

export const encryptionService = new EncryptionService();
