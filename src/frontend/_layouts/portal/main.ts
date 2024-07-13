import { useTheme } from "next-themes";

import { noop } from "@/shared/lib/noop";

export const usePortalThemes = () => {
  noop();
};

export const APP_THEMES = ["light", "dark"];

export const usePortalThemesSelection = () => {
  const { themes } = useTheme();
  return themes;
};
