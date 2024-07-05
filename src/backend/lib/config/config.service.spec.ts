/* eslint-disable no-new */
import fs from "fs-extra";
import path from "path";
import { typescriptSafeObjectDotEntries } from "shared/lib/objects";

import type { ConfigKeys } from "./config.service";
import { ConfigApiService } from "./config.service";

const VALID_CONFIG: Record<ConfigKeys, string> = {
  CONFIG_ADAPTOR: "json-file",
  CONFIG_ADAPTOR_CONNECTION_STRING:
    "PLACE_HOLDER_CONFIG_ADAPTOR_CONNECTION_STRING",

  CACHE_ADAPTOR: "memory",
  CACHE_ADAPTOR_CONNECTION_STRING:
    "PLACE_HOLDER_CACHE_ADAPTOR_CONNECTION_STRING",

  CREDENTIALS_ENCRYPTION_KEY:
    "TEST123*!@#testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest",
  AUTH_TOKEN_KEY:
    "TEST123*!@#testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest",
};

const bootstrapConfig = (changes: Record<string, unknown>) => {
  new ConfigApiService({
    ...VALID_CONFIG,
    ...changes,
  });
};

const ENV_LOCAL_FILE = ".env.unit.local";

describe("Config Service", () => {
  beforeEach(() => {
    ConfigApiService.isInitialized = false;
  });

  describe("validation", () => {
    it("should validate `CACHE_ADAPTOR_CONNECTION_STRING`", async () => {
      expect(() => {
        bootstrapConfig({ CACHE_ADAPTOR_CONNECTION_STRING: true });
      }).toThrow(`'Cache Adaptor Connection' should be a string`);
    });

    it("should validate `CONFIG_ADAPTOR_CONNECTION_STRING`", () => {
      expect(() => {
        bootstrapConfig({ CONFIG_ADAPTOR_CONNECTION_STRING: true });
      }).toThrow(`'Config Adaptor Connection' should be a string`);
    });

    it("should validate `CONFIG_ADAPTOR`", () => {
      expect(() =>
        bootstrapConfig({ CONFIG_ADAPTOR: "invalid-value" })
      ).toThrow(
        `Invalid Config Adaptor name provided 'invalid-value'. Valid values are json-file,database,memory,redis`
      );
    });

    it("should validate `CACHE_ADAPTOR`", () => {
      expect(() => bootstrapConfig({ CACHE_ADAPTOR: "invalid-value" })).toThrow(
        `Invalid Cache Adaptor name provided 'invalid-value'. Valid values are memory,redis`
      );
    });

    it("should validate `CREDENTIALS_ENCRYPTION_KEY`", () => {
      expect(() =>
        bootstrapConfig({
          CREDENTIALS_ENCRYPTION_KEY:
            "less-than-64-chars-no-uppercase-no-numbers",
        })
      ).toThrow(
        `Encryption Key must contain uppercase letters, lowercase letters, numbers and be more than 64 characters`
      );
    });

    it("should validate `AUTH_TOKEN_KEY`", () => {
      expect(() => {
        bootstrapConfig({
          AUTH_TOKEN_KEY: "less-than-64-chars-no-uppercase-no-numbers",
        });
      }).toThrow(
        `Auth token Key must contain uppercase letters, lowercase letters, numbers and be more than 64 characters`
      );
    });

    it("should not throw any error for valid env", () => {
      expect(() => bootstrapConfig({})).not.toThrow();
    });
  });

  describe("generation", () => {
    const fullPath = path.resolve(process.cwd(), ENV_LOCAL_FILE);

    beforeEach(() => {
      fs.removeSync(fullPath);
    });

    it("should throw error on prod for empty env", async () => {
      ConfigApiService.isInitialized = false;

      expect(
        () =>
          new ConfigApiService({
            ENV_LOCAL_FILE,
            NODE_ENV: "production",
          })
      ).toThrow();
    });

    it("should create new valid config file when empty", async () => {
      new ConfigApiService({ ENV_LOCAL_FILE });

      const content = fs.readFileSync(fullPath).toString();

      const newEnv = Object.fromEntries(
        content
          .split("\n")
          .filter((value) => value)
          .filter((value) => !value.startsWith("#"))
          .map((value) => value.split("="))
      );

      expect(() => new ConfigApiService(newEnv)).not.toThrow();

      ConfigApiService.isInitialized = false;

      newEnv.CONFIG_ADAPTOR = "hello";

      expect(() => new ConfigApiService(newEnv)).toThrow(
        "Invalid Config Adaptor name provided 'hello'. Valid values are json-file,database,memory,redis"
      );
    });

    it("should only append missing config fields", async () => {
      const oldEnv = {
        CONFIG_ADAPTOR_CONNECTION_STRING: "test",
        CACHE_ADAPTOR: "redis",
        CREDENTIALS_ENCRYPTION_KEY:
          "TEST123*!@#foobfoobfoobfoobfoobfoobfoobfoobfoobfoobfoobfoobfoobfoobfoobfoobfoobfoobfoobtesttesttesttest",
      };

      fs.writeFileSync(
        fullPath,
        typescriptSafeObjectDotEntries(oldEnv)
          .map(([key, value]) => `${key}=${value}`)
          .join("\n")
      );

      new ConfigApiService({
        ...oldEnv,
        ENV_LOCAL_FILE,
      });

      const content = fs.readFileSync(fullPath).toString();

      const newEnv = Object.fromEntries(
        content
          .split("\n")
          .filter((value) => value)
          .filter((value) => !value.startsWith("#"))
          .map((value) => value.split("="))
      );

      expect(() => new ConfigApiService(newEnv)).not.toThrow();

      expect(newEnv.CONFIG_ADAPTOR_CONNECTION_STRING).toBe("test");
      expect(newEnv.CACHE_ADAPTOR).toBe("redis");
      expect(newEnv.CREDENTIALS_ENCRYPTION_KEY).toBe(
        "TEST123*!@#foobfoobfoobfoobfoobfoobfoobfoobfoobfoobfoobfoobfoobfoobfoobfoobfoobfoobfoobtesttesttesttest"
      );
    });
  });
});
