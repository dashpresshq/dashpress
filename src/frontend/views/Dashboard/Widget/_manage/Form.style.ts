import styled from "styled-components";

export const GridSpan = styled.div<{ $span?: number }>`
  grid-column-start: span ${(props) => props.$span || 2};
`;
