import { generatorHandler, GeneratorOptions } from "@prisma/generator-helper";
import { logger } from "@prisma/sdk";
import path from "path";
import { writeFileSafely } from "./utils/writeFileSafely";

const { version } = require("../package.json");

const GENERATOR_NAME = "Cardinal";

generatorHandler({
  onManifest() {
    logger.info(`${GENERATOR_NAME}:Registered`);
    return {
      version,
      defaultOutput: "../generated",
      prettyName: GENERATOR_NAME,
    };
  },
  onGenerate: async (options: GeneratorOptions) => {
      console.log("Here");
    const writeLocation = path.join(".", `cardinal.json`);

    await writeFileSafely(writeLocation, options.dmmf.datamodel);
  },
});
