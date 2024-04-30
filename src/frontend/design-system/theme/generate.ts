import { typescriptSafeObjectDotEntries } from "shared/lib/objects";
import { REPLACE_WITH_PRIMARY } from "./modes";
import { IColorMode, IRootColors } from "./types";

export const colorModeToRootColors = (
  primaryColor: string,
  colorMode: IColorMode
): Record<IRootColors, string> => {
  return Object.fromEntries(
    typescriptSafeObjectDotEntries({
      ...colorMode,
      "primary-color": primaryColor,
      "primary-shade-color": primaryColor + colorMode["shade-opacity"],
    }).map(([key, value]) => {
      return [key, value === REPLACE_WITH_PRIMARY ? primaryColor : value];
    })
  ) as Record<IRootColors, string>;
};
