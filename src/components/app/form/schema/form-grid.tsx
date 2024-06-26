import { gridItem } from "frontend/design-system/constants/grid";
import { ReactNode } from "react";
import { GridSpanSizes } from "shared/types/ui";
import styled from "styled-components";

export const FormGrid = {
  Root: ({ children }: { children: ReactNode }) => (
    <div className="@container">
      <div className="grid-root auto-rows-auto items-center">{children}</div>
    </div>
  ),
  Item: styled.div<{
    $span?: GridSpanSizes;
  }>`
    ${gridItem}
  `,
};
