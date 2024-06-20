import Link from "next/link";
import { Loader } from "react-feather";
import { BaseSyntheticEvent } from "react";
import { useLingui } from "@lingui/react";
import { Tooltip } from "../tooltip";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useConfirmAlert } from "../confirm-alert";
import { IActionButton } from "./types";
import { SystemIcon } from "../system-icons";

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
    <Loader className="w-[14px] h-[14px] animate-spin" />
  ) : size === "icon" ? (
    <SystemIcon icon={systemIcon} className="w-[14px] h-[14px]" />
  ) : (
    <div className="flex gap-2 w-auto items-center">
      <SystemIcon icon={systemIcon} className="w-[14px] h-[14px]" />
      <span className="whitespace-nowrap hidden md:inline-block">
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
    <Tooltip text={labelString}>{buttonElement}</Tooltip>
  ) : (
    buttonElement
  );
}
