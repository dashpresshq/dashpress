import { Settings, Home, Table, Users, Shield, Zap } from "react-feather";
import { NAVIGATION_LINKS, useNavigationStack } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types/user";
import { useUserHasPermission } from "frontend/hooks/auth/user.store";
import { useUserActiveEntities } from "../../hooks/entity/entity.store";
import { ROOT_LINKS_TO_CLEAR_BREADCRUMBS } from "./constants";
import { IAppMenuItems } from "./types";
import { useAppendPortalMenuItems } from "./portal";

export const useSelectionViews = (): IAppMenuItems[] => {
  const activeEntities = useUserActiveEntities();
  const userHasPermission = useUserHasPermission();

  const { clear } = useNavigationStack();

  const appendPortalMenuItems = useAppendPortalMenuItems();

  const menuItems: IAppMenuItems[] = [
    {
      title: "Home",
      icon: Home,
      action: ROOT_LINKS_TO_CLEAR_BREADCRUMBS.HOME,
      order: 10,
    },
    {
      title: "Tables",
      description: "Your models",
      icon: Table,
      viewMenuItems: {
        singular: "Entity",
        menuItems: {
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
      order: 20,
    },
    {
      title: "Actions",
      icon: Zap,
      action: ROOT_LINKS_TO_CLEAR_BREADCRUMBS.ACTIONS,
      isPermissionAllowed: userHasPermission(
        USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS
      ),
      order: 30,
    },
    {
      title: "Settings",
      icon: Settings,
      action: ROOT_LINKS_TO_CLEAR_BREADCRUMBS.SETTINGS,
      isPermissionAllowed: userHasPermission(
        USER_PERMISSIONS.CAN_CONFIGURE_APP
      ),
      order: 40,
    },
    {
      title: "Users",
      icon: Users,
      action: ROOT_LINKS_TO_CLEAR_BREADCRUMBS.USERS,
      isPermissionAllowed: userHasPermission(USER_PERMISSIONS.CAN_MANAGE_USERS),
      order: 50,
    },
    {
      title: "Roles",
      icon: Shield,
      action: ROOT_LINKS_TO_CLEAR_BREADCRUMBS.ROLES,
      isPermissionAllowed: userHasPermission(
        USER_PERMISSIONS.CAN_MANAGE_PERMISSIONS
      ),
      order: 60,
    },
  ];

  return appendPortalMenuItems(menuItems)
    .filter(({ isPermissionAllowed, notFinished }) => {
      if (notFinished) {
        return process.env.NEXT_PUBLIC_SHOW_UNFINISHED_FEATURES;
      }
      if (isPermissionAllowed === undefined) {
        return true;
      }
      return isPermissionAllowed;
    })
    .sort((a, b) => a.order - b.order);
};
