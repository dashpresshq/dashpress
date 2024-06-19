import { useContext, useEffect } from "react";
import { ColorSchemes } from "shared/types/ui";
import { typescriptSafeObjectDotEntries } from "shared/lib/objects";
import { DEFAULT_PRIMARY_COLOR } from "./constants";
import { ThemeContext } from "./Context";
import { colorModeToRootColors } from "./generate";
import { DARK_MODE, LIGHT_MODE } from "./modes";
import { IColorMode } from "./types";
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

    typescriptSafeObjectDotEntries(rootColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(
        prefixVarNameSpace(key),
        value
      );
    });
  }, [themeColor, colorMode]);
};
