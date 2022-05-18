import { convertPrismaBlockToJson } from "./blocks-to-json";
import { splitFilesLinesIntoArray } from "./lines-to-array";
import { convertPrismaLinesToBlocks } from "./lines-to-block";
import { loadPrismaFile } from "./load-schema";

export const parsePrismaSchema = async () => {
    const prismaFile = await loadPrismaFile();
    const prismaLines = splitFilesLinesIntoArray(prismaFile);
  
    const prismaBlocks = convertPrismaLinesToBlocks(prismaLines);

    const prismaJson = prismaBlocks.map((block) => convertPrismaBlockToJson(block))
  console.log(prismaJson);
    // console.log(prismaJson);
  };

