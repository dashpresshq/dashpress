import { DataStateKeys } from "frontend/lib/data/types";
import { ColorSchemes } from "shared/types/ui";
import { IThemeSettings } from "./types";

export const getThemePrimaryColor = (
  theme: ColorSchemes,
  themeColor: DataStateKeys<IThemeSettings>
) =>
  theme === "dark" ? themeColor.data?.primaryDark : themeColor.data?.primary;
