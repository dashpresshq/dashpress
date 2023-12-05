import { IDropDownMenuItem } from "frontend/design-system/components/DropdownMenu";
import { ISectionBoxIconButton } from "frontend/design-system/components/Section/SectionBox/types";
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

export const useSectionBoxIconButtons = ({
  entity,
  entityId,
}: {
  entity: string;
  entityId: string;
}): ISectionBoxIconButton[] => {
  noop(entity, entityId);
  return [];
};
