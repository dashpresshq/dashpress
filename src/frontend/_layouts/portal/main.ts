import { IColorMode } from "frontend/design-system/theme/types";
import { noop } from "shared/lib/noop";
import { ColorSchemes } from "shared/types/ui";

export const processThemeColors = (
  primaryColor: string,
  theme: ColorSchemes | IColorMode,
  _: unknown
) => {
  noop(_);
  return { primaryColor, theme };
};

export const usePortalThemes = () => ({});
