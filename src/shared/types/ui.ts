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

export type GridSpanSizes =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12";

export type GridHeightSizes = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
