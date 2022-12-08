import { BREAKPOINTS } from "@hadmean/chromista";
import styled, { css } from "styled-components";

export const gridRoot = css`
  user-select: none;
  display: grid;
  grid-gap: 16px;
  grid-template-columns: auto auto auto auto;
  @media (max-width: ${BREAKPOINTS.lg}) {
    grid-template-columns: auto auto;
  }
  @media (max-width: ${BREAKPOINTS.sm}) {
    grid-template-columns: auto;
  }
`;

export const Root = styled.div<{ hasSetting: boolean }>`
  ${(props) =>
    props.hasSetting &&
    css`
      cursor: grab;
      user-select: none;
    `}
`;

export const TableRoot = styled(Root)`
  grid-column-start: 1;
  grid-column-end: 5;

  @media (max-width: ${BREAKPOINTS.lg}) {
    grid-column-end: 3;
  }
  @media (max-width: ${BREAKPOINTS.sm}) {
    grid-column-end: 2;
  }
`;
