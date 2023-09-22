import { noop } from "shared/lib/noop";
import { INavigationMenuItem } from "shared/types/menu";

export const portalCheckIfIsMenuAllowed = async (
  menuItem: INavigationMenuItem,
  userRole: string,
  userPermissions: string[]
): Promise<boolean | undefined> => {
  noop(menuItem, userRole, userPermissions);
  return undefined;
};

export const getPortalMenuItems = (
  userRole: string
): Promise<INavigationMenuItem[] | null> => {
  noop(userRole);
  return null;
};
