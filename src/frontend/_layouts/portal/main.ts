import { IColorMode } from "@hadmean/chromista";
import noop from "lodash/noop";

export const processThemeColors = (
  primaryColor: string,
  theme: "light" | "dark" | IColorMode,
  _: unknown
) => {
  noop(_);
  return { primaryColor, theme };
};

export const PRO_THEMES = [];
