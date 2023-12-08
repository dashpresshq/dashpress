export interface IColorableSelection {
  color?: string;
  label: string;
  value: string | boolean;
}

export type EntityTypesForSelection =
  | "selection"
  | "selection-enum"
  | "boolean";

export const FOR_CODE_COV = 1;

export type ColorSchemes = "light" | "dark";

export type IThemeSettings = {
  primary: string;
  primaryDark: string;
};

export type GridSpanSizes = "1" | "2" | "3" | "4";

export type GridHeightSizes = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
