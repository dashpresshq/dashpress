import { IGroupActionButton } from "./types";

export const DELETE_BUTTON_PROPS = (props: {
  action: () => void;
  isMakingRequest: boolean;
  label: string;
  shouldConfirmAlert?: undefined;
}): IGroupActionButton => ({
  id: "delete",
  systemIcon: "Thrash",
  shouldConfirmAlert: "Confirm Delete",
  color: "danger",
  ...props,
});
