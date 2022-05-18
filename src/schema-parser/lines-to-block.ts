import { PrimaBlocks } from "./types";

export const convertPrismaLinesToBlocks = (lines: string[]): string[][] => {
    const prismaBlocksArrays = Object.keys(PrimaBlocks);
  
    const prismaBlocks: string[][] = [];
  
    let inBlockMode = false;
  
    for (let i = 0; i <= lines.length; i++) {
      const line = lines[i];
  
      if (line && prismaBlocksArrays.includes(line.split(" ")[0])) {
        inBlockMode = true;
        prismaBlocks.push([]);
      }
      if (inBlockMode) {
        prismaBlocks[prismaBlocks.length - 1].push(line);
      }
  
      if (line === "}") {
        inBlockMode = false;
      }
    }
  
    return prismaBlocks;
  };