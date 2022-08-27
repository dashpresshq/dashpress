import { Settings, Home, Table, Users, User, Shield } from "react-feather";
import { ISelectionView } from "@hadmean/chromista/dist/Layouts/types";
import { NAVIGATION_LINKS } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types";
import { useUserHasPermissions } from "frontend/hooks/auth/user.store";
import { useEntitiesMenuItems } from "../../hooks/entity/entity.store";
import { ROOT_LINKS_TO_CLEAR_BREADCRUMBS } from "./constants";

interface ILayoutSelectionView extends ISelectionView {
  isPermissionAllowed?: boolean;
}

export const useSelectionViews = (): ILayoutSelectionView[] => {
  const entitiesMenuItems = useEntitiesMenuItems();
  const hasPermission = useUserHasPermissions([
    USER_PERMISSIONS.CAN_CONFIGURE_APP,
    USER_PERMISSIONS.CAN_MANAGE_USER,
    USER_PERMISSIONS.CAN_MANAGE_PERMISSIONS,
  ]);
  return [
    {
      title: "Home",
      icon: Home,
      action: ROOT_LINKS_TO_CLEAR_BREADCRUMBS.HOME,
    },
    {
      title: "Tables",
      description: "Your models",
      icon: Table,
      viewMenuItems: {
        ...entitiesMenuItems,
        data: (entitiesMenuItems.data || []).map(({ label, value }) => ({
          title: label,
          searchKeywordsField: value,
          action: NAVIGATION_LINKS.ENTITY.TABLE(value),
        })),
      },
    },
    {
      title: "Settings",
      icon: Settings,
      action: ROOT_LINKS_TO_CLEAR_BREADCRUMBS.SETTINGS,
      isPermissionAllowed: hasPermission(USER_PERMISSIONS.CAN_CONFIGURE_APP),
    },
    {
      title: "Users",
      icon: Users,
      action: ROOT_LINKS_TO_CLEAR_BREADCRUMBS.USERS,
      isPermissionAllowed: hasPermission(USER_PERMISSIONS.CAN_MANAGE_USER),
    },
    {
      title: "Roles",
      icon: Shield,
      action: ROOT_LINKS_TO_CLEAR_BREADCRUMBS.ROLES,
      isPermissionAllowed: hasPermission(
        USER_PERMISSIONS.CAN_MANAGE_PERMISSIONS
      ),
    },
    {
      title: "Account",
      icon: User,
      action: ROOT_LINKS_TO_CLEAR_BREADCRUMBS.ACCOUNT,
    },
  ].filter(({ isPermissionAllowed }) => {
    if (isPermissionAllowed === undefined) {
      return true;
    }
    return isPermissionAllowed;
  });
};
