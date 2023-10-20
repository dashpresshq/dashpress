import { IRootColors } from "./types";

export const prefixVarNameSpace = (color: string) => `--dashpress-${color}`;

export const USE_ROOT_COLOR = (color: IRootColors) => {
  return `var(${prefixVarNameSpace(color)})`;
};
