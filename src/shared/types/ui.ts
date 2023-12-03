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
