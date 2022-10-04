import { IApplicationService } from "backend/types";
import fs from "fs-extra";
import path from "path";
import { ConfigBag } from "./constants";
import { ConfigKeys, NodeEnvironments } from "./types";

export { ConfigKeys, NodeEnvironments };

export class ConfigService implements IApplicationService {
  static isInitialized = false;

  getNodeEnvironment(): NodeEnvironments {
    return this.processEnv.NODE_ENV as NodeEnvironments;
  }

  // eslint-disable-next-line no-undef
  constructor(protected processEnv: Record<string, unknown> = process.env) {
    this.assertConfiguration();
  }

  async bootstrap() {
    this.assertConfiguration();
  }

  getConfigValue<T>(key: ConfigKeys): T {
    return this.processEnv[key] as unknown as T;
  }

  assertConfiguration() {
    // if (ConfigService.isInitialized) {
    //   return;
    // }
    // ConfigService.isInitialized = true;
    const newEnvEntries: { key: ConfigKeys; value: string }[] = [];

    Object.entries(ConfigBag).forEach(([key, configBag]) => {
      const value = this.processEnv[key];
      if (!value) {
        if (this.processEnv.NODE_ENV === "production") {
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
        this.processEnv[envEntry.key] = envEntry.value;
        envContent.push(`${envEntry.key}=${envEntry.value}`);
      });
      envContent.push("# GENERATED ENV ENDS HERE");
      fs.appendFile(
        path.resolve(
          process.cwd(),
          (this.processEnv.ENV_LOCAL as string) || ".env.local"
        ),
        envContent.join("\n")
      );
    }

    Object.entries(ConfigBag).forEach(([key, configBag]) => {
      const value = this.processEnv[key];
      configBag.validate(value);
    });
  }
}

export const configService = new ConfigService();
