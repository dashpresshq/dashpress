import { useCallback, useContext, useEffect } from "react";
import { darken } from "polished";
import { DEFAULT_PRIMARY_COLOR } from "./constants";
import { ThemeContext } from "./Context";
import { colorModeToRootColors } from "./generate";
import { DARK_MODE, LIGHT_MODE } from "./modes";
import { IColorMode, IRootColors } from "./types";
import { prefixVarNameSpace } from "./root";

const getColorModeImplementation = (
  colorMode?: "light" | "dark" | IColorMode
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

export const useTheme = (
  themeColor?: string,
  colorMode?: "light" | "dark" | IColorMode
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
      const color$1 = themeContext.value[colorKey];
      return darken(`${percent / 100}`, color$1);
    },
    [themeContext.value]
  );
};
