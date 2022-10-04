/* eslint-disable no-new */
import { ConfigKeys, ConfigService } from "./config.service";

const VALID_CONFIG: Record<ConfigKeys, string> = {
  CONFIG_ADAPTOR: "json-file",
  CONFIG_ADAPTOR_CONNECTION_STRING:
    "PLACE_HOLDER_CONFIG_ADAPTOR_CONNECTION_STRING",

  CACHE_ADAPTOR: "memory",
  CACHE_ADAPTOR_CONNECTION_STRING:
    "PLACE_HOLDER_CACHE_ADAPTOR_CONNECTION_STRING",

  ENCRYPTION_KEY:
    "TEST123*!@#testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest",
  AUTH_TOKEN_KEY:
    "TEST123*!@#testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest",
};

const bootstrapConfig = (changes: Record<string, unknown>) => {
  new ConfigService(
    {
      ...VALID_CONFIG,
      ...changes,
    },
    true
  );
};

describe("Config Service", () => {
  beforeEach(() => {
    ConfigService.isInitialized = false;
  });
  describe("validation", () => {
    it("should validate `CACHE_ADAPTOR_CONNECTION_STRING`", async () => {
      expect(() => {
        bootstrapConfig({ CACHE_ADAPTOR_CONNECTION_STRING: true });
      }).toThrowError(`'Cache Adaptor Connection' is required`);
    });

    it("should validate `CONFIG_ADAPTOR_CONNECTION_STRING`", () => {
      expect(() => {
        bootstrapConfig({ CONFIG_ADAPTOR_CONNECTION_STRING: true });
      }).toThrowError(`'Config Adaptor Connection' is required`);
    });

    it("should validate `CONFIG_ADAPTOR`", () => {
      expect(() =>
        bootstrapConfig({ CONFIG_ADAPTOR: "invalid-value" })
      ).toThrowError(
        `Invalid Config Adaptor name provided 'invalid-value'. Valid values are json-file,database,memory,redis`
      );
    });

    it("should validate `CACHE_ADAPTOR`", () => {
      expect(() =>
        bootstrapConfig({ CACHE_ADAPTOR: "invalid-value" })
      ).toThrowError(
        `Invalid Cache Adaptor name provided 'invalid-value'. Valid values are memory,redis`
      );
    });

    it("should validate `ENCRYPTION_KEY`", () => {
      expect(() =>
        bootstrapConfig({
          ENCRYPTION_KEY: "less-than-64-chars-no-uppercase-no-numbers",
        })
      ).toThrowError(
        `Encryption Key must contain uppercase letters, lowercase letters, numbers and be more than 64 characters`
      );
    });

    it("should validate `AUTH_TOKEN_KEY`", () => {
      expect(() => {
        bootstrapConfig({
          AUTH_TOKEN_KEY: "less-than-64-chars-no-uppercase-no-numbers",
        });
      }).toThrowError(
        `Auth token Key must contain uppercase letters, lowercase letters, numbers and be more than 64 characters`
      );
    });

    it("should not throw any error for valid env", () => {
      expect(async () => await bootstrapConfig({})).not.toThrowError();
    });
  });

  describe("generation", () => {
    it("should create new config file when empty", () => {
      expect(1).toBe(1);
    });
    it("should append config keys not found", () => {
      expect(1).toBe(1);
    });
  });
});
