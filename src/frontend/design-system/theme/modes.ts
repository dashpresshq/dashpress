import { IColorMode } from "./types";

export const REPLACE_WITH_PRIMARY = "REPLACE_WITH_PRIMARY";

export const DARK_MODE: IColorMode = {
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

export const LIGHT_MODE: IColorMode = {
  "soft-color": "#f1f5fa",
  "muted-text": "#a4abc5",
  "main-text": "#5f6270",
  "border-color": "#e3ebf6",
  "base-color": "#ffffff",
  "foundation-color": "#f3f6f9",
  "text-on-primary": "#ffffff",
  "text-on-shade": REPLACE_WITH_PRIMARY,
  "shade-opacity": "1A",
};
