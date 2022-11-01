import { BREAKPOINTS } from "@hadmean/chromista";
import { css } from "styled-components";

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
