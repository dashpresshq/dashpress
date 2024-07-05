import { noop } from "shared/lib/noop";
import type { INavigationMenuItem } from "shared/types/menu";
import type { IBaseNavigationMenuApiService } from "../types";

export const portalCheckIfIsMenuAllowed = async (
  menuItem: INavigationMenuItem,
  userRole: string
): Promise<boolean | undefined> => {
  noop(menuItem, userRole);
  return undefined;
};

export const getPortalMenuItems = (
  userRole: string,
  navigationMenuApiService: IBaseNavigationMenuApiService
): Promise<INavigationMenuItem[] | null> => {
  noop(userRole, navigationMenuApiService);
  return null;
};
