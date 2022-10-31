import { useAppConfiguration } from "frontend/hooks/configuration/configuration.store";
import { useEffect } from "react";

const shade = (color: string, yes: boolean) => (yes ? `${color}5A` : color);

interface IColorMode {
  "inverse-text": string;
  "soft-color": string;
  "muted-text": string;
  "main-text": string;
  "border-color": string;
  "base-color": string;
  "foundation-color": string;
}

const DARK_MODE: IColorMode = {
  "inverse-text": "#ffffff",
  "soft-color": "#21262d",
  "muted-text": "#8b949e",
  "main-text": "#c9d1d9",
  "border-color": "#30363d",
  "base-color": "#161b22",
  "foundation-color": "#0d1117",
};

const LIGHT_MODE: IColorMode = {
  "main-text": "#5f6270",
  "inverse-text": "#ffffff",
  "muted-text": "#a4abc5",
  "border-color": "#e3ebf6",
  "soft-color": "#f1f5fa",
  "base-color": "#ffffff",
  "foundation-color": "#f3f6f9",
};

export const useAppTheme = () => {
  const themeColor = useAppConfiguration<{ primary: string; dark: boolean }>(
    "theme_color"
  );
  useEffect(() => {
    if (themeColor.data?.primary) {
      const primaryColor = themeColor.data?.primary;
      document.documentElement.style.setProperty(
        "--hadmean-primary-color",
        shade(primaryColor, themeColor.data?.dark)
      );
      document.documentElement.style.setProperty(
        "--hadmean-primary-shade-color",
        shade(primaryColor, !themeColor.data?.dark)
      );
    }
    Object.entries(themeColor.data.dark ? DARK_MODE : LIGHT_MODE).forEach(
      ([key, value]) => {
        document.documentElement.style.setProperty(`--hadmean-${key}`, value);
      }
    );
  }, [themeColor]);
};
