import { useAppConfiguration } from "frontend/hooks/configuration/configuration.store";
import { useEffect } from "react";

interface IColorMode {
  "soft-color": string;
  "muted-text": string;
  "main-text": string;
  "border-color": string;
  "base-color": string;
  "foundation-color": string;
  "text-on-primary": string;
  "text-on-shade": string;
  "shade-opacity": string;
}

const REPLACE_WITH_PRIMARY = "REPLACE_WITH_PRIMARY";

const DARK_MODE: IColorMode = {
  "soft-color": "#21262d",
  "muted-text": "#8b949e",
  "main-text": "#c9d1d9",
  "border-color": "#30363d",
  "base-color": "#161b22",
  "foundation-color": "#0d1117",
  "text-on-primary": "#ffffff",
  "text-on-shade": "#ffffff",
  "shade-opacity": "5A",
};

const LIGHT_MODE: IColorMode = {
  "main-text": "#5f6270",
  "muted-text": "#a4abc5",
  "border-color": "#e3ebf6",
  "soft-color": "#f1f5fa",
  "base-color": "#ffffff",
  "foundation-color": "#f3f6f9",
  "text-on-primary": "#ffffff",
  "text-on-shade": REPLACE_WITH_PRIMARY,
  "shade-opacity": "1A",
};

export const useAppTheme = () => {
  const themeColor = useAppConfiguration<{ primary: string; dark: boolean }>(
    "theme_color"
  );
  const colorMode = themeColor.data.dark ? DARK_MODE : LIGHT_MODE;
  useEffect(() => {
    const primaryColor = themeColor.data?.primary || "#4b38b3";

    document.documentElement.style.setProperty(
      "--hadmean-primary-color",
      primaryColor
    );
    document.documentElement.style.setProperty(
      "--hadmean-primary-shade-color",
      primaryColor + colorMode["shade-opacity"]
    );

    Object.entries(colorMode).forEach(([key, value]) => {
      if (value.startsWith("#")) {
        document.documentElement.style.setProperty(
          `--hadmean-${key}`,
          value === REPLACE_WITH_PRIMARY ? primaryColor : value
        );
      }
    });
  }, [themeColor]);
};
