import { useAppConfiguration } from "frontend/hooks/configuration/configuration.store";
import { IColorMode, useTheme } from "@hadmean/chromista";
import { useAuthenticatedUserPreferences } from "frontend/hooks/auth/user.store";
import { IRootColors } from "@hadmean/chromista/dist/theme/types";
import { darken } from "polished";
import { useCallback } from "react";
import { processThemeColors } from "./portal";
import { IThemeSettings } from "./types";
import { getThemePrimaryColor } from "./utils";

export const useUserThemePreference = () => {
  const themeColor = useAppConfiguration<IThemeSettings>("theme_color");
  const userPreferences = useAuthenticatedUserPreferences();

  const theme: "light" | "dark" | IColorMode =
    (userPreferences.data?.theme as "light" | "dark") || "light";

  const primaryColor = getThemePrimaryColor(theme, themeColor);

  return processThemeColors(primaryColor, theme, themeColor);
};

export const useAppTheme = () => {
  const { primaryColor, theme } = useUserThemePreference();
  useTheme(primaryColor, theme);
};

export const prefixVarNameSpace = (color: string) => `--hadmean-${color}`;

export const useThemeColorShade = () => {
  const { primaryColor, theme } = useUserThemePreference();

  return useCallback(
    (colorKey: IRootColors, percent: number) => {
      const color$1 = document.documentElement.style.getPropertyValue(
        prefixVarNameSpace(colorKey)
      );
      return darken(`${percent / 100}`, color$1);
    },
    [typeof document, primaryColor, theme]
  );
};
