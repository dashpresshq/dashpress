import { useCallback, useContext, useEffect } from "react";
import { ColorSchemes } from "shared/types/ui";
import { DEFAULT_PRIMARY_COLOR } from "./constants";
import { ThemeContext } from "./Context";
import { colorModeToRootColors } from "./generate";
import { DARK_MODE, LIGHT_MODE } from "./modes";
import { IColorMode, IRootColors } from "./types";
import { prefixVarNameSpace } from "./root";

const getColorModeImplementation = (
  colorMode?: ColorSchemes | IColorMode
): IColorMode => {
  if (!colorMode) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? DARK_MODE
      : LIGHT_MODE;
  }
  if (typeof colorMode === "string") {
    return colorMode === "light" ? LIGHT_MODE : DARK_MODE;
  }
  return colorMode;
};

function darkenHexColor(hexColor$1: string, percentage: number) {
  const hexColor = hexColor$1.replace(/^#/, "");

  // Convert hexadecimal to RGB
  let red = parseInt(hexColor.substring(0, 2), 16);
  let green = parseInt(hexColor.substring(2, 4), 16);
  let blue = parseInt(hexColor.substring(4, 6), 16);

  // Calculate darken percentage
  const darkenFactor = 1 - percentage / 100;

  // Darken RGB components
  red = Math.max(0, Math.floor(red * darkenFactor));
  green = Math.max(0, Math.floor(green * darkenFactor));
  blue = Math.max(0, Math.floor(blue * darkenFactor));

  // Convert back to hexadecimal
  const darkenedHexColor = `#${red.toString(16).padStart(2, "0")}${green
    .toString(16)
    .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;

  return darkenedHexColor;
}

export const useTheme = (
  themeColor?: string,
  colorMode?: ColorSchemes | IColorMode
) => {
  const themeContext = useContext(ThemeContext);

  useEffect(() => {
    const colorModeImplementation = getColorModeImplementation(colorMode);
    const primaryColor = themeColor || DEFAULT_PRIMARY_COLOR;

    const rootColors = colorModeToRootColors(
      primaryColor,
      colorModeImplementation
    );

    themeContext.set(rootColors);

    Object.entries(rootColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(
        prefixVarNameSpace(key),
        value
      );
    });
  }, [themeColor, colorMode]);
};

export const useThemeColorShade = () => {
  const themeContext = useContext(ThemeContext);

  return useCallback(
    (colorKey: IRootColors, percent: number) => {
      return darkenHexColor(themeContext.value[colorKey], percent);
    },
    [themeContext.value]
  );
};
