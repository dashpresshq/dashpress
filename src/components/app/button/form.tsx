import type { MessageDescriptor } from "@lingui/core";
import { useLingui } from "@lingui/react";
import type { VariantProps } from "class-variance-authority";
import React from "react";
import { Loader } from "react-feather";
import type { SystemIconsKeys } from "shared/constants/Icons";

import type { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { SystemIcon } from "../system-icons";

interface IFormButton {
  text: (isMakingRequest: boolean) => MessageDescriptor;
  systemIcon: SystemIconsKeys;
  isMakingRequest: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  size?: VariantProps<typeof buttonVariants>["size"];
  variant?: "outline";
  className?: string;
}

export function ActionButtonIsMakingRequest({
  isMakingRequest,
  systemIcon,
  text,
}: {
  isMakingRequest: boolean;
  text: (isMakingRequest: boolean) => MessageDescriptor;
  systemIcon: SystemIconsKeys;
}) {
  const { _ } = useLingui();

  return (
    <div className="flex w-auto items-center justify-center gap-2">
      {isMakingRequest ? (
        <>
          <Loader className="size-4 animate-spin" />
          <span>{_(text(true))}</span>
        </>
      ) : (
        <>
          <SystemIcon icon={systemIcon} className="size-4" />
          <span>{_(text(false))}</span>
        </>
      )}
    </div>
  );
}

export function FormButton({
  text,
  disabled,
  isMakingRequest,
  onClick,
  systemIcon,
  variant,
  size = "lg",
  className,
}: IFormButton) {
  const toRender = (
    <ActionButtonIsMakingRequest
      isMakingRequest={isMakingRequest}
      text={text}
      systemIcon={systemIcon}
    />
  );

  return (
    <div className="flex justify-end">
      <Button
        disabled={disabled || isMakingRequest}
        onClick={onClick}
        variant={variant}
        size={size}
        type="submit"
        className={cn(className, { "cursor-progress": isMakingRequest })}
      >
        {toRender}
      </Button>
    </div>
  );
}
