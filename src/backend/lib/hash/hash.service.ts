import * as bcrypt from "bcryptjs";

export class HashService {
  static async make(text: string): Promise<string> {
    return await bcrypt.hash(text, 10);
  }

  static async compare(
    plainString: string,
    hashedString: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainString, hashedString);
  }
}
