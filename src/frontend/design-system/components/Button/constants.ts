import { MessageDescriptor } from "@lingui/core";
import { IGroupActionButton } from "./types";

export const DELETE_BUTTON_PROPS = (props: {
  action: () => void;
  isMakingRequest: boolean;
  label: MessageDescriptor;
  shouldConfirmAlert?: undefined;
}): IGroupActionButton => ({
  id: "delete",
  systemIcon: "Thrash",
  shouldConfirmAlert: "Confirm Delete",
  color: "danger",
  ...props,
});
