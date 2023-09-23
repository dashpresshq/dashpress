import { noop } from "shared/lib/noop";
import { INavigationMenuItem } from "shared/types/menu";
import { IBaseNavigationMenuApiService } from "../types";

export const portalCheckIfIsMenuAllowed = async (
  menuItem: INavigationMenuItem,
  userRole: string,
  userPermissions: string[]
): Promise<boolean | undefined> => {
  noop(menuItem, userRole, userPermissions);
  return undefined;
};

export const getPortalMenuItems = (
  userRole: string,
  navigationMenuApiService: IBaseNavigationMenuApiService
): Promise<INavigationMenuItem[] | null> => {
  noop(userRole, navigationMenuApiService);
  return null;
};
