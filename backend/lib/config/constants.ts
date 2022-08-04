import { StringUtils } from "@gothicgeeks/shared";
import { ConfigAdaptorTypes } from "../config-persistence/types";
import { ConfigKeys } from "./types";

interface IConfigBag {
  defaultValue: () => string;
  validate: (value: string) => void;
}

const tokenValidations = (value: string, label: string) => {
  const TOKEN_LENGTH = 64;
  if (value.length < TOKEN_LENGTH) {
    throw new Error(
      `${label} needs to be more than ${TOKEN_LENGTH} characters`
    );
  }
  // TODO
  // if (
  //   !/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{64,}$/.test(
  //     value
  //   )
  // ) {
  //   const errorText = `${label} must contain uppercase letters, lowercase letters, numbers, special characters and be more than 64 characters`;
  //   throw new Error(errorText);
  // }
};

const optionsValidation = (value: string, label: string, options: string[]) => {
  if (!options.includes(value as ConfigAdaptorTypes)) {
    throw new Error(
      `Invalid ${label} name provided '${value}'. Valid values are ${options}`
    );
  }
};

const stringValidation = (value: string, label: string, optional?: true) => {
  if (!optional && !value) {
    throw new Error(`'${label}'is required`);
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
  CONFIG_ADAPTOR_CONNECTION_STRING: {
    defaultValue: () => {
      return "";
    },
    validate: (value) => {
      stringValidation(value, "Config Adaptor Connection", true);
    },
  },
  ENCRYPTION_KEY: {
    defaultValue: () => {
      return StringUtils.generateRandomGibberish(128);
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
      return StringUtils.generateRandomGibberish(128);
    },
    validate: (value) => {
      tokenValidations(value, "Auth token Key");
    },
  },
};
