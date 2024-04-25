import { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/macro";
import { IGroupActionButton } from "./types";

export const DELETE_BUTTON_PROPS = (props: {
  action: () => void;
  isMakingRequest: boolean;
  label: MessageDescriptor;
  shouldConfirmAlert?: undefined;
}): IGroupActionButton => ({
  id: "delete",
  systemIcon: "Thrash",
  shouldConfirmAlert: msg`Confirm Delete`,
  color: "danger",
  ...props,
});
