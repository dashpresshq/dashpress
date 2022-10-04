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

describe("Config Service", () => {
  describe("validation", () => {
    it("should validate `CACHE_ADAPTOR_CONNECTION_STRING`", () => {
      expect(() => {
        new ConfigService({
          ...VALID_CONFIG,
          CACHE_ADAPTOR_CONNECTION_STRING: 5,
        });
      }).toThrowError(`'Cache Adaptor Connection' is required`);
    });

    it("should validate `CACHE_ADAPTOR_CONNECTION_STRING`", () => {
      expect(() => {
        new ConfigService({
          ...VALID_CONFIG,
          CONFIG_ADAPTOR_CONNECTION_STRING: true,
        });
      }).toThrowError(`'Config Adaptor Connection' is required`);
    });

    it("should validate `CONFIG_ADAPTOR`", () => {
      expect(() => {
        new ConfigService({
          ...VALID_CONFIG,
          CONFIG_ADAPTOR: "invalid-value",
        });
      }).toThrowError(
        `Invalid Config Adaptor name provided 'invalid-value'. Valid values are json-file,database,memory,redis`
      );
    });

    it("should validate `ENCRYPTION_KEY`", () => {
      expect(() => {
        new ConfigService({
          ...VALID_CONFIG,
          ENCRYPTION_KEY: "less-than-64-chars-no-uppercase-no-numbers",
        });
      }).toThrowError(
        `Encryption Key must contain uppercase letters, lowercase letters, numbers and be more than 64 characters`
      );
    });

    it("should validate `AUTH_TOKEN_KEY`", () => {
      expect(() => {
        new ConfigService({
          ...VALID_CONFIG,
          AUTH_TOKEN_KEY: "less-than-64-chars-no-uppercase-no-numbers",
        });
      }).toThrowError(
        `Auth token Key must contain uppercase letters, lowercase letters, numbers and be more than 64 characters`
      );
    });
  });
});
