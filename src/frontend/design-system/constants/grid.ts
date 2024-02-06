import { css } from "styled-components";
import { GridHeightSizes, GridSpanSizes } from "shared/types/ui";
import { BREAKPOINTS } from "./breakpoints";

export const gridHeightToPx = (unit: GridHeightSizes) => +unit * 100;

export const gridRoot = css`
  display: grid;
  column-gap: 16px;
  grid-template-columns: repeat(12, 1fr);
  @media (max-width: ${BREAKPOINTS.lg}) {
    grid-template-columns: 1fr;
  }
`;

export const gridItem = css<{
  $span: GridSpanSizes;
}>`
  grid-column-start: span ${(props) => props.$span || "12"};

  @media (max-width: ${BREAKPOINTS.lg}) {
    grid-column-start: span 1;
  }
`;
