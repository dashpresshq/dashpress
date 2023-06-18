import { BREAKPOINTS } from "@hadmean/chromista";
import styled from "styled-components";

export const GridSpan = styled.div<{ $span?: number }>`
  grid-column-start: span ${(props) => props.$span || 2};
  @media (max-width: ${BREAKPOINTS.lg}) {
    grid-column-start: initial;
  }
`;
