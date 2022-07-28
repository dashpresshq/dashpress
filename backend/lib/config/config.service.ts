import { ConfigBag } from "./constants";
import { ConfigKeys, NodeEnvironments } from "./types";

export { ConfigKeys, NodeEnvironments };

export class ConfigService {
  getNodeEnvironment(): NodeEnvironments {
    const env = process.env.NODE_ENV as NodeEnvironments;
    if (!env) {
      throw new Error("NODE_ENV is not set");
    }
    if (!Object.values(NodeEnvironments).includes(env)) {
      throw new Error(
        `Invalid NODE_ENV provided '${env}'. Valid values are ${Object.values(
          NodeEnvironments
        )}`
      );
    }
    return env;
  }

  getConfigValue<T>(key: ConfigKeys): T {
    return process.env[key] as unknown as T;
  }
}

const newEnvEntries: { key: ConfigKeys; value: string }[] = [];

Object.entries(ConfigBag).forEach(([key, configBag]) => {
  const value = process.env[key];
  if (!value) {
    if (process.env.NODE_ENV === "production") {
      const message = `ENV variable with key '${key}' is missing`;
      throw new Error(message);
    } else {
      newEnvEntries.push({
        key: key as ConfigKeys,
        value: configBag.defaultValue(),
      });
    }
  }
});

if (newEnvEntries.length > 0) {
  newEnvEntries.forEach((envEntry) => {
    process.env[envEntry.key] = envEntry.value;
  });
  // TODO save this to the env local file
}

Object.entries(ConfigBag).forEach(([key, configBag]) => {
  const value = process.env[key];
  configBag.validate(value);
});

export const configService = new ConfigService();

configService.getConfigValue(ConfigKeys.AUTH_TOKEN_KEY);

// TODO send a request to boostsrap the application
