import { IMenuSectionItem } from "frontend/design-system/components/Section/MenuSection";
import { noop } from "shared/lib/noop";

export const useMutateBaseEntitySettingsMenu = (
  entity: string,
  baseMenu: IMenuSectionItem[]
) => {
  noop(entity);
  return baseMenu;
};
