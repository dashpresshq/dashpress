import styled from "styled-components";
import { SystemIconsKeys, systemIconToSVG } from "shared/constants/Icons";
import { CSSProperties } from "react";
import { IRootColors } from "../theme/types";
import { USE_ROOT_COLOR } from "../theme/root";

const IconRoot = styled.span<{ $size: number; $color?: IRootColors }>`
  ${(props) =>
    props.$color &&
    `
      color: ${USE_ROOT_COLOR(props.$color)};
    `}
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  display: inline-block;
  svg {
    vertical-align: initial;
  }
`;

interface IProps {
  size: number;
  label?: string;
  color?: IRootColors;
  icon: SystemIconsKeys;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
}

export function SystemIcon({
  size,
  icon,
  color,
  label,
  strokeWidth,
  style,
  className,
}: IProps) {
  if (!icon) {
    return null;
  }

  const iconSvg = systemIconToSVG(icon, strokeWidth);
  return (
    <IconRoot
      className={className}
      $color={color}
      $size={size}
      style={style}
      aria-label={label}
      dangerouslySetInnerHTML={{ __html: iconSvg }}
    />
  );
}
