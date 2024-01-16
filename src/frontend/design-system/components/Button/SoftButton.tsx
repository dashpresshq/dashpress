import React from "react";
import Link from "next/link";
import { Loader } from "react-feather";
import { SYSTEM_COLORS } from "frontend/design-system/theme/system";
import { Stack } from "frontend/design-system/primitives/Stack";
import { SystemIconsKeys } from "shared/constants/Icons";
import { SystemIcon } from "frontend/design-system/Icons/System";
import { SoftButtonStyled } from "./Button";
import { Spin } from "../_/Spin";
import { Tooltip } from "../Tooltip";

export interface IProps {
  label?: string;
  systemIcon?: SystemIconsKeys;
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
  systemIcon,
  justIcon,
  type,
  disabled,
  isMakingActionRequest,
  action,
  secondaryAction,
  className,
}: IProps) {
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
        <SystemIcon icon={systemIcon} {...iconProps} />
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

  const toolTipProps = {
    place: "top",
    text: justIcon && label,
  } as const;

  if (typeof action === "string") {
    return (
      <Tooltip {...toolTipProps}>
        <Link href={action} passHref>
          <SoftButtonStyled
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
          </SoftButtonStyled>
        </Link>
      </Tooltip>
    );
  }

  return (
    <Tooltip {...toolTipProps}>
      <SoftButtonStyled
        {...buttonProps}
        type={type}
        onClick={(e: { stopPropagation: () => void }) => {
          e.stopPropagation();
          action();
        }}
      >
        {content}
      </SoftButtonStyled>
    </Tooltip>
  );
}
