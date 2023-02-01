import { DataStateKeys } from "@hadmean/protozoa";
import { IThemeSettings } from "./types";

export const getThemePrimaryColor = (
  theme: "light" | "dark",
  themeColor: DataStateKeys<IThemeSettings>
) =>
  theme === "dark" ? themeColor.data?.primaryDark : themeColor.data?.primary;
