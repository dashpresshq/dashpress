import { IRootColors } from "./types";

export const prefixVarNameSpace = (color: string) => `--hadmean-${color}`;

export const USE_ROOT_COLOR = (color: IRootColors) => {
  return `var(${prefixVarNameSpace(color)})`;
};
