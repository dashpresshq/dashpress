import { createKeyValueDomainPersistenceService } from ".";
import type { KeyValueDomain } from "./types";

const keyValueStoreApiService = createKeyValueDomainPersistenceService<
  Record<string, unknown>
>("test-me" as KeyValueDomain);

const unTouchedkeyValueStoreApiService = createKeyValueDomainPersistenceService<
  Record<string, unknown>
>("un-touched" as KeyValueDomain);

describe("KeyValueStoreApiService", () => {
  it("should upsert data", async () => {
    await keyValueStoreApiService.persistItem({ bar: "bar" });
    await unTouchedkeyValueStoreApiService.persistItem({ bar: "bar" });
    expect(await keyValueStoreApiService.getItem()).toEqual({
      bar: "bar",
    });

    expect(await unTouchedkeyValueStoreApiService.getItem()).toEqual({
      bar: "bar",
    });

    await keyValueStoreApiService.persistItem({ foo: "foo" });
    expect(await keyValueStoreApiService.getItem()).toEqual({
      foo: "foo",
    });

    expect(await unTouchedkeyValueStoreApiService.getItem()).toEqual({
      bar: "bar",
    });
  });

  it("should clear items", async () => {
    await keyValueStoreApiService.persistItem({ bar2: "baz2" });

    await keyValueStoreApiService.clearItem();

    expect(await keyValueStoreApiService.getItem()).toBeNull();

    expect(await unTouchedkeyValueStoreApiService.getItem()).toEqual({
      bar: "bar",
    });
  });
});
