import {
  Settings,
  Home,
  Table,
  BarChart,
  Users,
  User,
  Shield,
} from "react-feather";
import { ISelectionView } from "@gothicgeeks/design-system/dist/Layouts/types";
import { NAVIGATION_LINKS } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types";
import { useCanUserPermissions } from "frontend/hooks/auth/user.store";
import { useEntitiesMenuItems } from "../../hooks/entity/entity.store";
import { ROOT_LINKS_TO_CLEAR_BREADCRUMBS } from "./constants";

interface ILayoutSelectionView extends ISelectionView {
  isPermissionAllowed?: boolean;
}

export const useSelectionViews = (): ILayoutSelectionView[] => {
  const entitiesMenuItems = useEntitiesMenuItems();
  const canUser = useCanUserPermissions([
    USER_PERMISSIONS.CAN_CONFIGURE_APP,
    USER_PERMISSIONS.CAN_MANAGE_USER,
    USER_PERMISSIONS.CAN_MANAGE_PERMISSIONS,
  ]);
  return [
    {
      title: "Home",
      icon: Home,
      link: ROOT_LINKS_TO_CLEAR_BREADCRUMBS.HOME,
    },
    {
      title: "Tables",
      description: "Your models",
      icon: Table,
      viewMenuItems: {
        ...entitiesMenuItems,
        data: (entitiesMenuItems.data || []).map(({ label, value }) => ({
          title: label,
          link: NAVIGATION_LINKS.ENTITY.TABLE(value),
        })),
      },
    },
    {
      title: "Dashboards",
      description: "Your models",
      icon: BarChart,
      view: <>Demo View</>,
      // action: () => console.log("Baz"), TODO
    },
    {
      title: "Settings",
      icon: Settings,
      link: ROOT_LINKS_TO_CLEAR_BREADCRUMBS.SETTINGS,
      isPermissionAllowed: canUser(USER_PERMISSIONS.CAN_CONFIGURE_APP),
    },
    {
      title: "Users",
      icon: Users,
      link: ROOT_LINKS_TO_CLEAR_BREADCRUMBS.USERS,
      isPermissionAllowed: canUser(USER_PERMISSIONS.CAN_MANAGE_USER),
    },
    {
      title: "Roles",
      icon: Shield,
      link: ROOT_LINKS_TO_CLEAR_BREADCRUMBS.ROLES,
      isPermissionAllowed: canUser(USER_PERMISSIONS.CAN_MANAGE_PERMISSIONS),
    },
    {
      title: "Account",
      icon: User,
      link: ROOT_LINKS_TO_CLEAR_BREADCRUMBS.ACCOUNT,
    },
  ].filter(({ isPermissionAllowed }) => {
    if (isPermissionAllowed === undefined) {
      return true;
    }
    return isPermissionAllowed;
  });
};
