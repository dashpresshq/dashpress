import fs from "fs-extra";
import path from "path";

type ConfigTypes = "users" | "schema" | "credentials" | "app-config";

const pathToConfigFile = (type: ConfigTypes) => {
  const file =
    process.env.NODE_ENV === "test" ? `${type}.test.json` : `${type}.json`;
  return path.resolve(process.cwd(), ".config-data", file);
};

// TODO Allow adaptors for other file types
// DB
// Redis
// Firebase
// Memory

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
    // Extensions.excecute("CONFIG.PUT", async ({ type, data }) => {
    if (process.env.NODE_ENV === "test") {
      return;
    }
    await fs.writeJson(pathToConfigFile(type), data, { spaces: 2 });
    // });
  }
}
