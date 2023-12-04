import { DataStateKeys } from "frontend/lib/data/types";
import { ColorSchemes, IThemeSettings } from "shared/types/ui";

export const getThemePrimaryColor = (
  theme: ColorSchemes,
  themeColor: DataStateKeys<IThemeSettings>
) =>
  theme === "dark" ? themeColor.data?.primaryDark : themeColor.data?.primary;
