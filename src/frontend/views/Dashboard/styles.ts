import {
  GridSpanSizes,
  gridItem,
  gridRoot,
} from "frontend/design-system/constants/grid";
import styled, { css } from "styled-components";

export const dashboardGridRoot = css`
  ${gridRoot}
  user-select: none;
  row-gap: 16px;
  grid-auto-rows: minmax(130px, auto);
`;

export const WidgetRoot = styled.div<{
  hasSetting: boolean;
  $span: GridSpanSizes;
  $height: string;
}>`
  ${(props) =>
    props.hasSetting &&
    css`
      cursor: grab;
      user-select: none;
    `}

  ${gridItem};

  grid-row-start: span ${(props) => props.$height};
`;
