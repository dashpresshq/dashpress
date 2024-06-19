import { gridItem, gridRoot } from "frontend/design-system/constants/grid";
import { ReactNode } from "react";
import { GridSpanSizes } from "shared/types/ui";
import styled from "styled-components";

const Root = styled.div`
  ${gridRoot}
  grid-auto-rows: auto;
  align-items: center;
`;

// TOOD fix
const Container = styled.div`
  // container-type: inline-size;
`;

export const FormGrid = {
  Root: ({ children }: { children: ReactNode }) => (
    <Container>
      <Root>{children}</Root>
    </Container>
  ),
  Item: styled.div<{
    $span?: GridSpanSizes;
  }>`
    ${gridItem}
  `,
};
