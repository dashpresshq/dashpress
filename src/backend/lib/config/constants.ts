import { StringUtils } from "@hadmean/protozoa";
import { CacheAdaptorTypes } from "../cache/types";
import { ConfigAdaptorTypes } from "../config-persistence/types";
import { ConfigKeys } from "./types";

interface IConfigBag {
  defaultValue: () => string;
  validate: (value: unknown) => void;
}

const tokenValidations = (value: unknown, label: string) => {
  if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{64,}$/.test(value as string)) {
    const errorText = `${label} must contain uppercase letters, lowercase letters, numbers and be more than 64 characters`;
    throw new Error(errorText);
  }
};

const optionsValidation = (
  value: unknown,
  label: string,
  options: string[]
) => {
  if (!options.includes(value as ConfigAdaptorTypes)) {
    throw new Error(
      `Invalid ${label} name provided '${value}'. Valid values are ${options}`
    );
  }
};

const stringValidation = (value: unknown, label: string) => {
  if (typeof value !== "string") {
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
  CACHE_ADAPTOR_CONNECTION_STRING: {
    defaultValue: () => {
      return "PLACE_HOLDER_CACHE_ADAPTOR_CONNECTION_STRING_STRING";
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
  AUTH_TOKEN_KEY: {
    defaultValue: () => {
      return StringUtils.generateRandomString(128);
    },
    validate: (value) => {
      tokenValidations(value, "Auth token Key");
    },
  },
};
