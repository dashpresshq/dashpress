import { ReactNode, createContext, useState, useMemo } from "react";
import { LIGHT_MODE } from "../theme/modes";
import { DEFAULT_PRIMARY_COLOR } from "./constants";
import { colorModeToRootColors } from "./generate";
import { IRootColors } from "./types";

const DEFAULT_ROOT_COLOR: Record<IRootColors, string> = colorModeToRootColors(
  DEFAULT_PRIMARY_COLOR,
  LIGHT_MODE
);

export const ThemeContext = createContext<{
  value: Record<IRootColors, string>;
  set: (value: Record<IRootColors, string>) => void;
}>({ value: DEFAULT_ROOT_COLOR, set: () => {} });

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [colorMode, setColorMode] =
    useState<Record<IRootColors, string>>(DEFAULT_ROOT_COLOR);

  const contextValue = useMemo(
    () => ({ value: colorMode, set: setColorMode }),
    [colorMode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
