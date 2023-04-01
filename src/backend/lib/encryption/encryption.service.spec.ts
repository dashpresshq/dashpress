import { encryptionApiService } from "./encryption.service";

describe("Encryption Service", () => {
  it("should decrypt encrypted value correctly", async () => {
    expect(
      await encryptionApiService.decrypt(
        await encryptionApiService.encrypt("foo")
      )
    ).toBe("foo");
  });
});
