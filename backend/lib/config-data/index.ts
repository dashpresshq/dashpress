import fs from "fs-extra";
import path from "path";

type ConfigTypes = "users" | "schema" | "credentials" | "app-config";

const pathToConfigFile = (type: ConfigTypes) =>
  path.resolve(process.cwd(), ".config-data", `${type}.json`);

export class ConfigData {
  static async get(type: ConfigTypes, defaultValue: unknown) {
    try {
      // TODO allow external config like redis/ db, etc
      return (
        (await fs.readJson(pathToConfigFile(type), { throws: false })) ||
        defaultValue
      );
    } catch (error) {
      return defaultValue;
    }
  }

  static async put(type: ConfigTypes, data: unknown) {
    await fs.writeJson(pathToConfigFile(type), data, { spaces: 2 });
  }
}
