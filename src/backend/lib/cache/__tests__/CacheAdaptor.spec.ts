import {
  ConfigService,
  NodeEnvironments,
} from "backend/lib/config/config.service";
import { AbstractCacheService } from "../AbstractCacheService";
import { MemoryCacheAdaptor } from "../MemoryCacheAdaptor";
import { RedisCacheAdaptor } from "../RedisCacheAdaptor";

const prefix = "__test-cache-adaptor__";

const testConfigService: ConfigService = {
  assertConfiguration() {
    throw new Error("Not implemented");
  },
  bootstrap() {
    throw new Error("Not implemented");
  },
  getNodeEnvironment() {
    return NodeEnvironments.Test;
  },
  getConfigValue<T>() {
    return "redis://localhost" as unknown as T;
  },
};

const CACHE_ADAPTORS: {
  title: string;
  adaptor: AbstractCacheService;
}[] = [
  {
    title: "Memory",
    adaptor: new MemoryCacheAdaptor(prefix, testConfigService),
  },
  {
    title: "Redis",
    adaptor: new RedisCacheAdaptor(prefix, testConfigService),
  },
];

describe.each(CACHE_ADAPTORS)("$title cache adaptor", ({ adaptor }) => {
  beforeAll(async () => {
    await adaptor.setup();
    await adaptor.clearItem("foo");
  });

  it("should call fetcher the first time", async () => {
    const implementationMock = jest.fn();

    const data = await adaptor.getItem("foo", async () => {
      implementationMock();
      return { foo: "bar" };
    });

    expect(data).toEqual({ foo: "bar" });
    expect(implementationMock).toHaveBeenCalled();
  });

  it("should not call fetcher the next time", async () => {
    const implementationMock = jest.fn();

    const data = await adaptor.getItem("foo", async () => {
      implementationMock();
      return { foo: "wrong-value" };
    });

    expect(data).toEqual({ foo: "bar" });
    expect(implementationMock).not.toHaveBeenCalled();
  });

  it("should call fetcher after clearing key", async () => {
    const implementationMock = jest.fn();

    await adaptor.clearItem("foo");

    const data = await adaptor.getItem("foo", async () => {
      implementationMock();
      return { foo: "new-value" };
    });

    expect(data).toEqual({ foo: "new-value" });
    expect(implementationMock).toHaveBeenCalled();
  });
});
