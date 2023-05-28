import { useAppConfiguration } from "frontend/hooks/configuration/configuration.store";
import { IColorMode, useTheme } from "@hadmean/chromista";
import { useAuthenticatedUserPreferences } from "frontend/hooks/auth/user.store";
import { MAKE_CRUD_CONFIG } from "frontend/lib/makeCrudConfig";
import { processThemeColors } from "./portal";
import { IThemeSettings } from "./types";
import { getThemePrimaryColor } from "./utils";

export const THEME_SETTINGS_CRUD_CONFIG = MAKE_CRUD_CONFIG({
  path: "N/A",
  plural: "Theme Settings",
  singular: "Theme Settings",
});

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
