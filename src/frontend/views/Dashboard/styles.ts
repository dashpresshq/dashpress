import { gridItem } from "frontend/design-system/constants/grid";
import { GridSpanSizes } from "shared/types/ui";
import styled from "styled-components";

export const WidgetRoot = styled.div<{
  $span: GridSpanSizes;
  $height: string;
}>`
  ${gridItem};

  grid-row-start: span ${(props) => props.$height};
`;
