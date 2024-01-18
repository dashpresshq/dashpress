import { IGroupActionButton } from "frontend/design-system/components/Button/types";
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
  row,
}: {
  entity: string;
  entityId: string;
  baseActionButtons: IGroupActionButton[];
  from: "details" | "table-inline";
  row: Record<string, unknown>;
}): IGroupActionButton[] => {
  noop(entity, entityId, from, row);
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
