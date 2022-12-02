import { Settings, Home, Table, Users, Shield, Zap } from "react-feather";
import { ISelectionView } from "@hadmean/chromista/dist/Layouts/types";
import { NAVIGATION_LINKS, useNavigationStack } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types/user";
import { useUserHasPermissions } from "frontend/hooks/auth/user.store";
import { useActiveEntities } from "../../hooks/entity/entity.store";
import { ROOT_LINKS_TO_CLEAR_BREADCRUMBS } from "./constants";

interface ILayoutSelectionView extends ISelectionView {
  isPermissionAllowed?: boolean;
}

export const useSelectionViews = (): ILayoutSelectionView[] => {
  const activeEntities = useActiveEntities();
  const hasPermission = useUserHasPermissions([
    USER_PERMISSIONS.CAN_CONFIGURE_APP,
    USER_PERMISSIONS.CAN_MANAGE_USER,
    USER_PERMISSIONS.CAN_MANAGE_PERMISSIONS,
    USER_PERMISSIONS.CAN_MANAGE_ACTIONS,
  ]);

  const { clear } = useNavigationStack();

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
        ...activeEntities,
        data: (activeEntities.data || []).map(({ label, value }) => ({
          title: label,
          searchKeywords: value,
          secondaryAction: () => {
            clear();
          },
          action: NAVIGATION_LINKS.ENTITY.TABLE(value),
        })),
      },
    },
    {
      title: "Actions",
      icon: Zap,
      action: ROOT_LINKS_TO_CLEAR_BREADCRUMBS.ACTIONS,
      isPermissionAllowed: hasPermission(USER_PERMISSIONS.CAN_MANAGE_ACTIONS),
      featureFlag: true,
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
  ].filter(({ isPermissionAllowed, featureFlag }) => {
    if (featureFlag) {
      return process.env.NEXT_PUBLIC_FEATURE_FLAG;
    }
    if (isPermissionAllowed === undefined) {
      return true;
    }
    return isPermissionAllowed;
  });
};
