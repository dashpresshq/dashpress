import { useAppConfiguration } from "frontend/hooks/configuration/configuration.store";
import { useTheme } from "@hadmean/chromista";

export type IThemeSettings = {
  primary: string;
  primaryDark: string;
  dark: boolean;
};

export const useAppTheme = () => {
  const themeColor = useAppConfiguration<IThemeSettings>("theme_color");

  const isDarkMode = !!themeColor.data?.dark;

  useTheme(
    isDarkMode ? themeColor.data?.primaryDark : themeColor.data?.primary,
    isDarkMode ? "dark" : "light"
  );
};
