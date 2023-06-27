import { BREAKPOINTS } from "frontend/design-system/constants";
import styled from "styled-components";

export const GridSpan = styled.div<{ $span?: number }>`
  grid-column-start: span ${(props) => props.$span || 2};
  @media (max-width: ${BREAKPOINTS.lg}) {
    grid-column-start: initial;
  }
`;
