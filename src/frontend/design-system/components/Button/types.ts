import { MessageDescriptor } from "@lingui/core";
import { SYSTEM_COLORS } from "frontend/design-system/theme/system";
import { SystemIconsKeys } from "shared/constants/Icons";

export interface IActionButton {
  label: MessageDescriptor;
  systemIcon: SystemIconsKeys;
  action: string | (() => void);
  disabled?: boolean;
  shouldConfirmAlert?: MessageDescriptor;
  size?: "sm" | "xs";
  block?: true;
  noToolTip?: true;
  secondaryAction?: () => void;
  justIcon?: true;
  isMakingRequest?: boolean;
  color?: keyof typeof SYSTEM_COLORS;
}

export interface IGroupActionButton extends IActionButton {
  id: string;
  order?: number;
}
