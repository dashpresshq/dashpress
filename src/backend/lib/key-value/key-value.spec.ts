import { keyValueStoreApiService } from ".";

describe("KeyValueStoreApiService", () => {
  it("should return empty for none saved items", async () => {
    expect(await keyValueStoreApiService.getItem("non-existent")).toBeNull();
  });

  it("should persist items", async () => {
    await keyValueStoreApiService.persistItem("persist", { bar: "baz" });
    expect(await keyValueStoreApiService.getItem("persist")).toEqual({
      bar: "baz",
    });
  });

  it("should clear items", async () => {
    await keyValueStoreApiService.persistItem("clear1", { bar1: "baz1" });
    await keyValueStoreApiService.persistItem("clear2", { bar2: "baz2" });

    await keyValueStoreApiService.clearItem("clear1");

    expect(await keyValueStoreApiService.getItem("clear1")).toBeNull();
    expect(await keyValueStoreApiService.getItem("clear2")).toEqual({
      bar2: "baz2",
    });
  });
});
