import { IActionButton } from "frontend/design-system/components/Button/ActionButtons/types";
import { IDropDownMenuItem } from "frontend/design-system/components/DropdownMenu";
import { noop } from "shared/lib/noop";

export const useDetailsViewMenuItems = ({
  entity,
  entityId,
}: {
  entity: string;
  entityId: string;
}): IDropDownMenuItem[] => {
  noop(entity, entityId);
  return [];
};

export const usePortalActionButtons = ({
  entity,
  entityId,
}: {
  entity: string;
  entityId: string;
}): IActionButton[] => {
  noop(entity, entityId);
  return [];
};
