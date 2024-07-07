import { useLingui } from "@lingui/react";
import Link from "next/link";
import type { BaseSyntheticEvent } from "react";
import { Loader } from "react-feather";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/components/utils";

import { useConfirmAlert } from "../confirm-alert";
import { SystemIcon } from "../system-icons";
import { Tooltip } from "../tooltip";
import type { IActionButton } from "./types";

export function SoftButton({
  label,
  size,
  systemIcon,
  shouldConfirmAlert,
  disabled,
  isMakingRequest,
  action,
  variant = "soft",
  className,
}: IActionButton) {
  const confirmAlert = useConfirmAlert();

  const { _ } = useLingui();

  const labelString = _(label);

  // eslint-disable-next-line no-nested-ternary
  const content = isMakingRequest ? (
    <Loader className="size-[14px] animate-spin" />
  ) : size === "icon" ? (
    <SystemIcon icon={systemIcon} className="size-[14px]" />
  ) : (
    <div className="flex w-auto items-center gap-2">
      <SystemIcon icon={systemIcon} className="size-[14px]" />
      <span className="hidden whitespace-nowrap md:inline-block">
        {labelString}
      </span>
    </div>
  );

  const buttonProps = {
    "aria-label": size === "icon" ? labelString : undefined,
  };

  const buttonElement =
    typeof action === "string" ? (
      <Link
        className={cn(buttonVariants({ variant, size }), className)}
        href={action}
        target={action.startsWith("http") ? "_blank" : undefined}
        {...buttonProps}
      >
        {content}
      </Link>
    ) : (
      <Button
        variant={variant}
        size={size}
        type="button"
        className={className}
        disabled={disabled || isMakingRequest}
        onClick={(e: BaseSyntheticEvent) => {
          e.stopPropagation();

          if (shouldConfirmAlert) {
            return confirmAlert({
              title: shouldConfirmAlert,
              action,
            });
          }
          return action();
        }}
        {...buttonProps}
      >
        {content}
      </Button>
    );

  return size === "icon" ? (
    <Tooltip text={labelString} isOverAButton>
      {buttonElement}
    </Tooltip>
  ) : (
    buttonElement
  );
}
