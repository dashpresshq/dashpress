import { ConfigApiService } from "backend/lib/config/config.service";

import type { AbstractCacheService } from "../AbstractCacheService";
import { MemoryCacheAdaptor } from "../MemoryCacheAdaptor";
import { RedisCacheAdaptor } from "../RedisCacheAdaptor";

const CACHE_ADAPTORS: {
  title: string;
  adaptor: AbstractCacheService;
}[] = [
  {
    title: "Memory",
    adaptor: new MemoryCacheAdaptor(
      new ConfigApiService({ DO_NOT_BOOSTRAP_CONFIG: false })
    ),
  },
  {
    title: "Redis",
    adaptor: new RedisCacheAdaptor(
      new ConfigApiService({
        DO_NOT_BOOSTRAP_CONFIG: false,
        CACHE_ADAPTOR_CONNECTION_STRING: "redis://localhost",
      })
    ),
  },
];

describe.each(CACHE_ADAPTORS)("$title cache adaptor", ({ adaptor }) => {
  beforeAll(async () => {
    await adaptor.setup();
    await adaptor.clearItem("foo", "temp-storage");
  });

  it("should call fetcher the first time", async () => {
    const implementationMock = jest.fn();

    const data = await adaptor.getItem("foo", "temp-storage", async () => {
      implementationMock();
      return { foo: "bar" };
    });

    expect(data).toEqual({ foo: "bar" });
    expect(implementationMock).toHaveBeenCalled();
  });

  it("should not call fetcher the next time", async () => {
    const implementationMock = jest.fn();

    const data = await adaptor.getItem("foo", "temp-storage", async () => {
      implementationMock();
      return { foo: "wrong-value" };
    });

    expect(data).toEqual({ foo: "bar" });
    expect(implementationMock).not.toHaveBeenCalled();
  });

  it("should call fetcher after clearing key", async () => {
    const implementationMock = jest.fn();

    await adaptor.clearItem("foo", "temp-storage");

    const data = await adaptor.getItem("foo", "temp-storage", async () => {
      implementationMock();
      return { foo: "new-value" };
    });

    expect(data).toEqual({ foo: "new-value" });
    expect(implementationMock).toHaveBeenCalled();
  });

  it("should call fetcher after purging key", async () => {
    const implementationMock = jest.fn();

    await adaptor.purge();

    const data = await adaptor.getItem("foo", "temp-storage", async () => {
      implementationMock();
      return { foo: "new-value" };
    });

    expect(data).toEqual({ foo: "new-value" });
    expect(implementationMock).toHaveBeenCalled();
  });
});
