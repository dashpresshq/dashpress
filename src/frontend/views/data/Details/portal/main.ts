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
  baseActionButtons,
  from,
}: {
  entity: string;
  entityId: string;
  baseActionButtons: IActionButton[];
  from: "details" | "table-inline";
}): IActionButton[] => {
  noop(entity, entityId, from);
  return baseActionButtons;
};

export function PreDataDetails({
  entity,
  entityId,
}: {
  entity: string;
  entityId: string;
}) {
  noop(entity, entityId);
  return null;
}
