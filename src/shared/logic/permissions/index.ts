import { META_USER_PERMISSIONS, USER_PERMISSIONS } from "shared/constants/user";
import { SystemRoles } from "shared/types/user";
import { portalPermissionCheck, PORTAL_PERMISSION_HEIRACHIES } from "./portal";

/*
  IMPORTANT NOTE:
  LESSER PERMISSION FIRST
*/

const PERMISSION_HEIRACHIES = {
  [USER_PERMISSIONS.CAN_MANAGE_USERS]: USER_PERMISSIONS.CAN_RESET_PASSWORD,
  [USER_PERMISSIONS.CAN_CONFIGURE_APP]:
    USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS,
  [USER_PERMISSIONS.CAN_MANAGE_ALL_ENTITIES]:
    USER_PERMISSIONS.CAN_CONFIGURE_APP,
  ...PORTAL_PERMISSION_HEIRACHIES,
};

const doMetaPermissionCheck =
  (permissions: string[], requiredPermission: string) =>
  (metaCheck: string, allPermission: string): boolean | void => {
    if (
      requiredPermission.startsWith(metaCheck) &&
      permissions.includes(allPermission)
    ) {
      return true;
    }
  };

export const doesPermissionAllowPermission = (
  permissions: string[],
  requiredPermission: string
): boolean => {
  if (requiredPermission === META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED) {
    return true;
  }

  if (permissions.length === 0) {
    return false;
  }
  const doMetaPermissionCheck$1 = doMetaPermissionCheck(
    permissions,
    requiredPermission
  );

  const portalPermissionCheckResponse = portalPermissionCheck(
    doMetaPermissionCheck$1
  );

  if (typeof portalPermissionCheckResponse === "boolean") {
    return portalPermissionCheckResponse;
  }

  const entitiesMetaCheck = doMetaPermissionCheck$1(
    META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY("", false),
    USER_PERMISSIONS.CAN_MANAGE_ALL_ENTITIES
  );

  if (typeof entitiesMetaCheck === "boolean") {
    return entitiesMetaCheck;
  }

  const can = permissions.includes(requiredPermission);

  if (can) {
    return true;
  }

  if (!PERMISSION_HEIRACHIES[requiredPermission]) {
    return false;
  }

  return doesPermissionAllowPermission(
    permissions,
    PERMISSION_HEIRACHIES[requiredPermission]
  );
};

const doSystemRoleCheck = (
  role: string,
  requiredPermission: string
): boolean | void => {
  if (role === SystemRoles.Creator) {
    return true;
  }

  if (role === SystemRoles.Viewer) {
    return requiredPermission.startsWith(
      META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY("", false)
    );
  }
};

export const canRoleDoThisAsync = async (
  userRole: string,
  permission: string,
  getRolePermission: (role: string) => Promise<string[]>
): Promise<boolean> => {
  const systemRoleCheck = doSystemRoleCheck(userRole, permission);

  if (typeof systemRoleCheck === "boolean") {
    return systemRoleCheck;
  }

  const rolePermissions = await getRolePermission(userRole);

  return doesPermissionAllowPermission(rolePermissions, permission);
};

export const canRoleDoThisSync = (
  userRole: string,
  permission: string,
  rolePermissions: string[]
): boolean => {
  const systemRoleCheck = doSystemRoleCheck(userRole, permission);

  if (typeof systemRoleCheck === "boolean") {
    return systemRoleCheck;
  }

  return doesPermissionAllowPermission(rolePermissions, permission);
};
