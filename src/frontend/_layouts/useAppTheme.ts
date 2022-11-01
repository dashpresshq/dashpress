import { useAppConfiguration } from "frontend/hooks/configuration/configuration.store";
import { useTheme } from "@hadmean/chromista";
import { useAuthenticatedUserPreferences } from "frontend/hooks/auth/user.store";

export type IThemeSettings = {
  primary: string;
  primaryDark: string;
};

export const useAppTheme = () => {
  const themeColor = useAppConfiguration<IThemeSettings>("theme_color");
  const userPreferences = useAuthenticatedUserPreferences();

  const theme = userPreferences.data?.theme || "light";

  useTheme(
    theme === "dark" ? themeColor.data?.primaryDark : themeColor.data?.primary,
    theme
  );
};
