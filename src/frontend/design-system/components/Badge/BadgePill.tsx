import React from "react";
import styled, { css } from "styled-components";
import { SYSTEM_COLORS } from "../../theme";
import { StyledBadge } from "./Base";

const StyledBadgePill = styled(StyledBadge)<{
  isIconBadge?: true;
  color: string;
}>`
  background-color: ${(props) => SYSTEM_COLORS[props.color]};
  color: ${SYSTEM_COLORS.white};
  padding-right: 0.6em;
  padding-left: 0.6em;
  border-radius: 10rem;

  ${({ isIconBadge }) =>
    isIconBadge &&
    css`
      display: inline-block;
      position: absolute;
      top: 9px;
      right: 8px;
      border: 2px solid rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      padding: 4px;
      font-size: 10px;
    `}
`;

export interface IProps {
  value: number;
  color: keyof typeof SYSTEM_COLORS;
  isIconBadge?: true;
}

export function BadgePill({ value, color, isIconBadge }: IProps) {
  if (value === 0) {
    return null;
  }
  return (
    <StyledBadgePill color={color} isIconBadge={isIconBadge}>
      {value}
    </StyledBadgePill>
  );
}
