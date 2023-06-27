import { IColorMode } from "frontend/design-system/theme/types";
import { noop } from "shared/lib/noop";

export const processThemeColors = (
  primaryColor: string,
  theme: "light" | "dark" | IColorMode,
  _: unknown
) => {
  noop(_);
  return { primaryColor, theme };
};

export const usePortalThemes = () => ({});
