import React, { ReactNode } from "react";
import { DESIGN_SYSTEM_SIZES } from "../constants/sizes";

type SpacerSize = "xxs" | "xs" | "sm" | "md" | "xl" | "xxl";

interface IProps {
  size?: SpacerSize;
  children?: ReactNode;
  direction?: "horizontal";
}

const MARGIN_CONFIG: Record<SpacerSize, number> = {
  xxs: DESIGN_SYSTEM_SIZES.margin / 16,
  xs: DESIGN_SYSTEM_SIZES.margin / 8,
  sm: DESIGN_SYSTEM_SIZES.margin / 2,
  xl: DESIGN_SYSTEM_SIZES.margin * 1.5,
  xxl: DESIGN_SYSTEM_SIZES.margin * 2,
  md: DESIGN_SYSTEM_SIZES.margin,
};

const getMarginProps = (size: SpacerSize, direction?: "horizontal") => {
  return direction === "horizontal"
    ? {
        marginLeft: MARGIN_CONFIG[size],
        marginRight: MARGIN_CONFIG[size],
      }
    : { margin: MARGIN_CONFIG[size] };
};

export function Spacer({ size = "md", direction, children }: IProps) {
  return <div style={getMarginProps(size, direction)}>{children}</div>;
}
