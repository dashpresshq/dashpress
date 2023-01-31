import { useAppConfiguration } from "frontend/hooks/configuration/configuration.store";
import { useAuthenticatedUserPreferences } from "frontend/hooks/auth/user.store";
import { IColorMode } from "@hadmean/chromista";
import { useEffect } from "react";
import { IRootColors } from "@hadmean/chromista/dist/theme/types";
import { colorModeImplementation } from "./ebi";

export type IThemeSettings = {
  primary: string;
  primaryDark: string;
};

export const DEFAULT_PRIMARY_COLOR = "#4b38b3";

export const REPLACE_WITH_PRIMARY = "REPLACE_WITH_PRIMARY";

export const prefixVarNameSpace = (color: string) => `--hadmean-${color}`;

export const USE_ROOT_COLOR = (color: IRootColors) => {
  return `var(${prefixVarNameSpace(color)})`;
};

export const generateRootColors = (
  primaryColor: string,
  colorMode: IColorMode
): Record<string, string> => {
  const rootColors: Record<string, string> = {};

  rootColors[prefixVarNameSpace("primary-color")] = primaryColor;
  rootColors[prefixVarNameSpace("primary-shade-color")] =
    primaryColor + colorMode["shade-opacity"];

  Object.entries(colorMode).forEach(([key, value]) => {
    rootColors[prefixVarNameSpace(key)] =
      value === REPLACE_WITH_PRIMARY ? primaryColor : value;
  });
  return rootColors;
};

export const useTheme = (
  themeColor?: string,
  colorMode?: "light" | "dark" | IColorMode
) => {
  useEffect(() => {
    const primaryColor = themeColor || DEFAULT_PRIMARY_COLOR;
    Object.entries(
      generateRootColors(primaryColor, colorModeImplementation)
    ).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [themeColor, colorMode]);
};

export const useAppTheme = () => {
  const themeColor = useAppConfiguration<IThemeSettings>("theme_color");
  const userPreferences = useAuthenticatedUserPreferences();

  const theme = userPreferences.data?.theme || "light";

  useTheme(themeColor.data?.primary, theme);
};
