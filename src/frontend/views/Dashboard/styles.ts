import { gridItem, gridRoot } from "frontend/design-system/constants/grid";
import { GridSpanSizes } from "shared/types/ui";
import styled, { css } from "styled-components";

export const dashboardGridRoot = css`
  ${gridRoot}
  user-select: none;
  row-gap: 16px;
  grid-auto-rows: minmax(110px, auto);
`;

export const WidgetRoot = styled.div<{
  $span: GridSpanSizes;
  $height: string;
}>`
  ${gridItem};

  grid-row-start: span ${(props) => props.$height};
`;
