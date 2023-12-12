import { DataStateKeys } from "frontend/lib/data/types";
import { AppConfigurationValueType } from "shared/configurations/constants";
import { ColorSchemes } from "shared/types/ui";

export const getThemePrimaryColor = (
  theme: ColorSchemes,
  themeColor: DataStateKeys<AppConfigurationValueType<"theme_color">>
) =>
  theme === "dark" ? themeColor.data?.primaryDark : themeColor.data?.primary;
