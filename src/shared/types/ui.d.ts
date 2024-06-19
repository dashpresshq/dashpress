import { MessageDescriptor } from "@lingui/core";
import { SpectrumColorTypes } from "@/components/ui/spectrum";

export interface IColorableSelection {
  spectrum?: SpectrumColorTypes;
  label: MessageDescriptor;
  value: string | boolean;
}

export type EntityTypesForSelection =
  | "selection"
  | "selection-enum"
  | "boolean";

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
