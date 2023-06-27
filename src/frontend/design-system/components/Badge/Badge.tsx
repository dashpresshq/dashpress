import React from "react";
import styled from "styled-components";
import { SYSTEM_COLORS } from "frontend/design-system/theme/system";
import { StyledBadge } from "./Base";

const StyledSoftBadge = styled(StyledBadge)`
  background-color: ${(props) => SYSTEM_COLORS[props.color]};
  color: ${SYSTEM_COLORS.white};
`;

export interface IProps {
  text: string;
  color: keyof typeof SYSTEM_COLORS;
}

export function Badge({ text, color }: IProps) {
  return <StyledSoftBadge color={color}>{text}</StyledSoftBadge>;
}
