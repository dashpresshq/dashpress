import { gridItem } from "frontend/design-system/constants/grid";
import { ReactNode } from "react";
import { GridSpanSizes } from "shared/types/ui";
import styled from "styled-components";

// TOOD fix
const Container = styled.div`
  // container-type: inline-size;
`;

export const FormGrid = {
  Root: ({ children }: { children: ReactNode }) => (
    <Container>
      <div className="grid-root auto-rows-auto items-center">{children}</div>
    </Container>
  ),
  Item: styled.div<{
    $span?: GridSpanSizes;
  }>`
    ${gridItem}
  `,
};
