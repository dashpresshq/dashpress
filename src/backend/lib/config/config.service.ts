import { IApplicationService } from "backend/types";
import fs from "fs-extra";
import path from "path";
import { ConfigBag } from "./constants";
import { ConfigKeys, NodeEnvironments } from "./types";

export { ConfigKeys, NodeEnvironments };

let initialized = false;

export class ConfigService implements IApplicationService {
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

  constructor() {
    this.assertConfiguration();
  }

  async bootstrap() {
    this.assertConfiguration();
  }

  getConfigValue<T>(key: ConfigKeys): T {
    return process.env[key] as unknown as T;
  }

  assertConfiguration() {
    if (initialized) {
      return;
    }
    initialized = true;
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
      const envContent: string[] = [
        "# AUTOMATICALLY GENERATED ENV CONFIG FOR DEVELOPMENT STARTS HERE",
      ];
      newEnvEntries.forEach((envEntry) => {
        process.env[envEntry.key] = envEntry.value;
        envContent.push(`${envEntry.key}=${envEntry.value}`);
      });
      envContent.push("# GENERATED ENV ENDS HERE");
      fs.appendFile(
        path.resolve(process.cwd(), ".env.local"),
        envContent.join("\n")
      );
    }

    Object.entries(ConfigBag).forEach(([key, configBag]) => {
      const value = process.env[key];
      configBag.validate(value);
    });
  }
}

export const configService = new ConfigService();
