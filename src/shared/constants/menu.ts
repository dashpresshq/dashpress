import { ActionIntegrationKeys } from "shared/types/actions";
import { SystemLinks } from "shared/types/menu";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { META_USER_PERMISSIONS, USER_PERMISSIONS } from "./user";

export const SYSTEM_LINKS_CONFIG_MAP: Record<
  SystemLinks,
  {
    link: string;
    permission: string;
  }
> = {
  [SystemLinks.Settings]: {
    link: NAVIGATION_LINKS.SETTINGS.DEFAULT,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  },
  [SystemLinks.Home]: {
    link: NAVIGATION_LINKS.DASHBOARD.HOME,
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  },
  [SystemLinks.Roles]: {
    link: NAVIGATION_LINKS.ROLES.LIST,
    permission: USER_PERMISSIONS.CAN_MANAGE_PERMISSIONS,
  },
  [SystemLinks.Users]: {
    link: NAVIGATION_LINKS.USERS.LIST,
    permission: USER_PERMISSIONS.CAN_MANAGE_USERS,
  },
  [SystemLinks.Integrations]: {
    link: NAVIGATION_LINKS.INTEGRATIONS.ACTIONS(ActionIntegrationKeys.HTTP),
    permission: USER_PERMISSIONS.CAN_MANAGE_APP_CREDENTIALS,
  },
};
