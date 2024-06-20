import { css } from "styled-components";
import { GridHeightSizes, GridSpanSizes } from "shared/types/ui";
import { msg } from "@lingui/macro";
import { BREAKPOINTS } from "./breakpoints";

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

export const gridItem = css<{
  $span: GridSpanSizes;
}>`
  grid-column-start: span ${(props) => props.$span || "12"};

  @container (width < ${BREAKPOINTS.md}) {
    grid-column-start: span 1;
  }
`;

export const GRID_SPAN_OPTIONS = mapToUnitOptions([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
]);
