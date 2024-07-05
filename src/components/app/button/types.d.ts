import type { MessageDescriptor } from "@lingui/core";
import type { SystemIconsKeys } from "shared/constants/Icons";
import type { VariantProps } from "class-variance-authority";
import type { buttonVariants } from "@/components/ui/button";

export interface IActionButton {
  label: MessageDescriptor;
  systemIcon: SystemIconsKeys;
  action: string | (() => void);
  disabled?: boolean;
  className?: string;
  shouldConfirmAlert?: MessageDescriptor;
  size?: VariantProps<typeof buttonVariants>["size"];
  variant?: VariantProps<typeof buttonVariants>["variant"];
  isMakingRequest?: boolean;
}

export interface IGroupActionButton extends IActionButton {
  id: string;
  order?: number;
}

export interface IMenuActionItem extends IGroupActionButton {
  subtle?: boolean;
  destructive?: boolean;
  active?: boolean;
  secondaryAction?: () => void;
}
