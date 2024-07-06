import { msg } from "@lingui/macro";
import type { GridHeightSizes } from "shared/types/ui";

export const mapToUnitOptions = (values: number[]) => {
  return values.map((value) => {
    const singular = value;
    const plural = value;
    return {
      label: value === 1 ? msg`${singular} Unit` : msg`${plural} Units`,
      value: `${value}`,
    };
  });
};

export const gridHeightToPx = (unit: GridHeightSizes) => +unit * 100;

export const GRID_SPAN_OPTIONS = mapToUnitOptions([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
]);
