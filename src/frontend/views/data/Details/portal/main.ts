import { IDropDownMenuItem } from "frontend/design-system/components/DropdownMenu";
import { noop } from "shared/lib/noop";

export const useDetailsViewMenuItems = ({
  entity,
  entityId,
}: {
  entity: string;
  entityId: string;
}): IDropDownMenuItem[] => {
  const menuItems: IDropDownMenuItem[] = [];
  noop(entity, entityId);
  return menuItems;
};
