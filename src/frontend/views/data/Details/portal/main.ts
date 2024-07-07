import type {
  IGroupActionButton,
  IMenuActionItem,
} from "@/components/app/button/types";
import { noop } from "@/shared/lib/noop";

export const useDetailsViewMenuItems = ({
  entity,
  entityId,
}: {
  entity: string;
  entityId: string;
}): IMenuActionItem[] => {
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
