import { BREAKPOINTS } from "@hadmean/chromista";
import { WidgetSizes } from "shared/types/dashboard";
import styled, { css } from "styled-components";

export const gridRoot = css`
  user-select: none;
  display: grid;
  grid-gap: 16px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  @media (max-width: ${BREAKPOINTS.lg}) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: ${BREAKPOINTS.sm}) {
    grid-template-columns: 1fr;
  }
`;

const WIDGET_SIZE_CONFIG: Record<
  WidgetSizes,
  { lg: number; sm: number; xl: number }
> = {
  "1": {
    sm: 1,
    lg: 1,
    xl: 1,
  },
  "2": {
    sm: 1,
    lg: 2,
    xl: 2,
  },
  "4": {
    sm: 1,
    lg: 2,
    xl: 4,
  },
};

export const WidgetRoot = styled.div<{
  hasSetting: boolean;
  size: WidgetSizes;
}>`
  ${(props) =>
    props.hasSetting &&
    css`
      cursor: grab;
      user-select: none;
    `}
  grid-column-start: span ${(props) => WIDGET_SIZE_CONFIG[props.size].xl};

  @media (max-width: ${BREAKPOINTS.lg}) {
    grid-column-start: span ${(props) => WIDGET_SIZE_CONFIG[props.size].lg};
  }
  @media (max-width: ${BREAKPOINTS.sm}) {
    grid-column-start: span ${(props) => WIDGET_SIZE_CONFIG[props.size].sm};
  }
`;
