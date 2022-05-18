import { DataSourceBlockHandler } from "./datasource";
import { GeneratorBlockHandler } from "./generator";
import { ModelBlockHandler } from "./model";
import { EnumBlockHandler } from "./enum";
import { PrimaBlocks } from "../types";
import { BlockHandlerType } from "./types";


export const BlockHandlers: Record<PrimaBlocks, { handler:  BlockHandlerType }> = {
  [PrimaBlocks.datasource]: { handler: DataSourceBlockHandler },
  [PrimaBlocks.enum]: { handler: EnumBlockHandler },
  [PrimaBlocks.generator]: { handler: GeneratorBlockHandler },
  [PrimaBlocks.model]: { handler: ModelBlockHandler },
};
