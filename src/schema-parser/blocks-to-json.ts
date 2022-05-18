import { BlockHandlers } from "./blocks";
import { PrimaBlocks } from "./types";

interface IPrismaBlockJSON {
  blockType: PrimaBlocks;
  label: string;
  data: Record<string, string>;
}

export function convertPrismaBlockToJson(block: string[]): IPrismaBlockJSON {
  const [blockType, label] = block[0].split(" ") as [PrimaBlocks, string];

  const blockContent = block.filter(
    (_, index) => index > 0 && index < block.length - 1
  );

  return {
    blockType,
    label,
    data: BlockHandlers[blockType].handler(blockContent),
  };
}
