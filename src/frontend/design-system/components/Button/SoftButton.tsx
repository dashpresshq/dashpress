import Link from "next/link";
import { Loader } from "react-feather";
import { Stack } from "frontend/design-system/primitives/Stack";
import { SystemIcon } from "frontend/design-system/Icons/System";
import { BaseSyntheticEvent } from "react";
import { SoftButtonStyled } from "./Button";
import { Spin } from "../_/Spin";
import { Tooltip } from "../Tooltip";
import { ConfirmAlert } from "../ConfirmAlert";
import { IActionButton } from "./types";

export function SoftButton({
  label,
  block,
  size = "sm",
  systemIcon,
  justIcon,
  shouldConfirmAlert,
  disabled,
  isMakingRequest,
  action,
  noToolTip,
  color,
  secondaryAction,
}: IActionButton) {
  const iconProps = {
    size: 14,
  };

  const content = isMakingRequest ? (
    <Spin as={Loader} {...iconProps} />
  ) : (
    <Stack
      $spacing={4}
      $width="auto"
      $align="center"
      $justify={block ? "center" : undefined}
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
    size,
    block,
    disabled: disabled || isMakingRequest,
    $justIcon: justIcon,
    $color: color,
    "aria-label": justIcon ? label : undefined,
  };

  const toolTipProps = {
    place: "top",
    text: justIcon && !noToolTip && label,
  } as const;

  if (typeof action === "string") {
    return (
      <Tooltip {...toolTipProps}>
        <SoftButtonStyled
          as={Link}
          href={action}
          target={action.startsWith("http") ? "_blank" : undefined}
          {...buttonProps}
        >
          {secondaryAction ? (
            <span onClick={secondaryAction} aria-hidden="true">
              {content}
            </span>
          ) : (
            content
          )}
        </SoftButtonStyled>
      </Tooltip>
    );
  }

  return (
    <Tooltip {...toolTipProps}>
      <SoftButtonStyled
        {...buttonProps}
        type="button"
        onClick={(e: BaseSyntheticEvent) => {
          e.stopPropagation();

          if (shouldConfirmAlert) {
            return ConfirmAlert({
              title: shouldConfirmAlert,
              action,
            });
          }
          return action();
        }}
      >
        {content}
      </SoftButtonStyled>
    </Tooltip>
  );
}
