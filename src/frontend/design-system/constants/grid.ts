import { css } from "styled-components";
import { BREAKPOINTS } from "./breakpoints";

export type GridSpanSizes = "1" | "2" | "3" | "4";

export type GridHeightSizes = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";

export const gridHeightToPx = (unit: GridHeightSizes) => +unit * 100;

export const GRID_SPAN_CONFIG: Record<
  GridSpanSizes,
  { lg: number; sm: number; xl: number }
> = {
  "1": {
    sm: 1,
    lg: 1,
    xl: 1,
  },
  "2": {
    sm: 1,
    lg: 2,
    xl: 2,
  },
  "3": {
    sm: 1,
    lg: 2,
    xl: 3,
  },
  "4": {
    sm: 1,
    lg: 2,
    xl: 4,
  },
};

export const gridRoot = css`
  display: grid;
  column-gap: 16px;
  grid-template-columns: repeat(4, 1fr);
  @media (max-width: ${BREAKPOINTS.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: ${BREAKPOINTS.sm}) {
    grid-template-columns: 1fr;
  }
`;

export const gridItem = css<{
  $span: GridSpanSizes;
}>`
  grid-column-start: span ${(props) => GRID_SPAN_CONFIG[props.$span].xl};

  @media (max-width: ${BREAKPOINTS.lg}) {
    grid-column-start: span ${(props) => GRID_SPAN_CONFIG[props.$span].lg};
  }
  @media (max-width: ${BREAKPOINTS.sm}) {
    grid-column-start: span ${(props) => GRID_SPAN_CONFIG[props.$span].sm};
  }
`;
