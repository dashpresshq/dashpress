import { gridItem, gridRoot } from "frontend/design-system/constants/grid";
import { GridSpanSizes } from "shared/types/ui";
import styled from "styled-components";

export const FormGrid = {
  Root: styled.div`
    ${gridRoot}
    grid-auto-rows: auto;
  `,
  Item: styled.div<{
    $span?: GridSpanSizes;
  }>`
    ${gridItem}
  `,
};
