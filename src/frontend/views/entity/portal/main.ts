import type { IMenuActionItem } from "@/components/app/button/types";
import { noop } from "@/shared/lib/noop";

export const useMutateBaseEntitySettingsMenu = (
  entity: string,
  baseMenu: IMenuActionItem[]
) => {
  noop(entity);
  return baseMenu;
};
