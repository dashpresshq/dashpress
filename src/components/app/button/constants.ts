import { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/macro";
import { IMenuActionItem } from "./types";

export const DELETE_BUTTON_PROPS = (props: {
  action: () => void;
  isMakingRequest: boolean;
  label: MessageDescriptor;
  shouldConfirmAlert?: undefined;
}): IMenuActionItem => ({
  id: "delete",
  systemIcon: "Thrash",
  shouldConfirmAlert: msg`Confirm Delete`,
  destructive: true,
  variant: "destructive",
  ...props,
});
