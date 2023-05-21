import { tempStorageApiService } from ".";

describe("TempStorageApiService", () => {
  it("should return empty for none saved items", async () => {
    expect(await tempStorageApiService.getItem("non-existent")).toBeNull();
  });

  it("should persist items", async () => {
    await tempStorageApiService.persistItem("persist", { bar: "baz" }, 10);
    expect(await tempStorageApiService.getItem("persist")).toEqual({
      bar: "baz",
    });
  });

  it("should clear items", async () => {
    await tempStorageApiService.persistItem("clear1", { bar1: "baz1" }, 10);
    await tempStorageApiService.persistItem("clear2", { bar2: "baz2" }, 10);

    await tempStorageApiService.clearItem("clear1");

    expect(await tempStorageApiService.getItem("clear1")).toBeNull();
    expect(await tempStorageApiService.getItem("clear2")).toEqual({
      bar2: "baz2",
    });
  });

  it("should clear items when fetched past expire", async () => {
    jest.useFakeTimers();

    await tempStorageApiService.persistItem("expire", { expire: "expire" }, 10);

    expect(await tempStorageApiService.getItem("expire")).toEqual({
      expire: "expire",
    });

    jest.advanceTimersByTime(5000);

    expect(await tempStorageApiService.getItem("expire")).toEqual({
      expire: "expire",
    });

    jest.advanceTimersByTime(7000);

    expect(await tempStorageApiService.getItem("expire")).toBeNull();

    jest.useRealTimers();
  });
});
