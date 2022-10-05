import { encryptionService } from "./encryption.service";

describe("Encryption Service", () => {
  it("should decrypt encrypted value correctly", async () => {
    expect(
      await encryptionService.decrypt(await encryptionService.encrypt("foo"))
    ).toBe("foo");
  });
});
