import React from "react";
import Link from "next/link";
import { Loader } from "react-feather";
import { StyledSoftButton } from "./Button";
import { ButtonIconTypes, ICON_MAP } from "./constants";
import { SYSTEM_COLORS } from "../../theme";
import { Spin } from "../_/Spin";
import { Stack } from "../../primitives";

export interface IProps {
  label?: string;
  icon?: ButtonIconTypes;
  size?: "sm" | "xs";
  block?: true;
  disabled?: boolean;
  color?: keyof typeof SYSTEM_COLORS;
  action: string | (() => void);
  secondaryAction?: () => void;
  justIcon?: true;
  className?: string;
  type?: "button";
  isMakingActionRequest?: boolean;
}

export function SoftButton({
  label,
  block,
  color,
  size = "sm",
  icon,
  justIcon,
  type,
  disabled,
  isMakingActionRequest,
  action,
  secondaryAction,
  className,
}: IProps) {
  const Icon = icon ? ICON_MAP[icon] : null;
  const iconProps = {
    size: 14,
  };

  const content = isMakingActionRequest ? (
    <Spin as={Loader} {...iconProps} />
  ) : (
    <Stack
      spacing={4}
      width="auto"
      align="center"
      justify={block ? "center" : undefined}
    >
      <>
        {Icon ? <Icon {...iconProps} /> : null}
        <span style={{ whiteSpace: "nowrap" }}>
          {label && !justIcon ? label : null}
        </span>
      </>
    </Stack>
  );

  const buttonProps = {
    className,
    size,
    block,
    disabled,
    color,
    justIcon,
    "aria-label": justIcon ? label : undefined,
  };

  if (typeof action === "string") {
    return (
      <Link href={action} passHref>
        <StyledSoftButton
          {...buttonProps}
          as="a"
          target={action.startsWith("http") ? "_blank" : undefined}
        >
          {secondaryAction ? (
            <span onClick={secondaryAction} aria-hidden="true">
              {content}
            </span>
          ) : (
            content
          )}
        </StyledSoftButton>
      </Link>
    );
  }

  return (
    <StyledSoftButton
      {...buttonProps}
      type={type}
      onClick={(e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        action();
      }}
    >
      {content}
    </StyledSoftButton>
  );
}
