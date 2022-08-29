import { StringUtils } from "@hadmean/protozoa";
import { CacheAdaptorTypes } from "../cache/types";
import { ConfigAdaptorTypes } from "../config-persistence/types";
import { BooleanConfigValue, ConfigKeys } from "./types";

interface IConfigBag {
  defaultValue: () => string;
  validate: (value: string) => void;
}

const tokenValidations = (value: string, label: string) => {
  if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{64,}$/.test(value)) {
    const errorText = `${label} must contain uppercase letters, lowercase letters, numbers and be more than 64 characters`;
    throw new Error(errorText);
  }
};

const optionsValidation = (value: string, label: string, options: string[]) => {
  if (!options.includes(value as ConfigAdaptorTypes)) {
    throw new Error(
      `Invalid ${label} name provided '${value}'. Valid values are ${options}`
    );
  }
};

const stringValidation = (value: string, label: string) => {
  if (!value) {
    throw new Error(`'${label}' is required`);
  }
};

export const ConfigBag: Record<ConfigKeys, IConfigBag> = {
  CONFIG_ADAPTOR: {
    defaultValue: () => {
      return ConfigAdaptorTypes.JsonFile;
    },
    validate: (value) => {
      optionsValidation(
        value,
        "Config Adaptor",
        Object.values(ConfigAdaptorTypes)
      );
    },
  },
  CACHE_ADAPTOR: {
    defaultValue: () => {
      return CacheAdaptorTypes.Memory;
    },
    validate: (value) =>
      optionsValidation(
        value,
        "Cache Adaptor",
        Object.values(CacheAdaptorTypes)
      ),
  },
  CONFIG_ADAPTOR_CONNECTION_STRING: {
    defaultValue: () => {
      return "PLACE_HOLDER_CONFIG_ADAPTOR_CONNECTION_STRING";
    },
    validate: (value) => {
      stringValidation(value, "Config Adaptor Connection");
    },
  },
  CONFIG_CACHE_CONNECTION_STRING: {
    defaultValue: () => {
      return "PLACE_HOLDER_CONFIG_CACHE_CONNECTION_STRING";
    },
    validate: (value) => {
      stringValidation(value, "Cache Adaptor Connection");
    },
  },
  ENCRYPTION_KEY: {
    defaultValue: () => {
      return StringUtils.generateRandomString(128);
    },
    validate: (value) => {
      tokenValidations(value, "Encryption Key");
    },
  },
  TOKEN_VALIDITY_DURATION_IN_DAYS: {
    defaultValue: () => {
      return "14";
    },
    validate: (value) => {
      if (Number.isNaN(value)) {
        throw new Error(`Token Expiration in days needs to be a number`);
      }
    },
  },
  AUTH_TOKEN_KEY: {
    defaultValue: () => {
      return StringUtils.generateRandomString(128);
    },
    validate: (value) => {
      tokenValidations(value, "Auth token Key");
    },
  },
  FORCE_INTROSPECTION: {
    defaultValue: () => {
      return BooleanConfigValue.FALSE;
    },
    validate: (value) => {
      optionsValidation(value, "Force introspection", [
        BooleanConfigValue.TRUE,
        BooleanConfigValue.FALSE,
      ]);
    },
  },
};
