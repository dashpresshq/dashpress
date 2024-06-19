import { noop } from "shared/lib/noop";
import { IMenuActionItem } from "@/components/app/button/types";

export const useMutateBaseEntitySettingsMenu = (
  entity: string,
  baseMenu: IMenuActionItem[]
) => {
  noop(entity);
  return baseMenu;
};
