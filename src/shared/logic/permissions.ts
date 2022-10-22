import {
  META_USER_PERMISSIONS,
  SystemRoles,
  USER_PERMISSIONS,
} from "shared/types";

export const doesPermissionAllowPermission = (
  permissions: string[],
  requiredPermission: string
): boolean => {
  if (
    requiredPermission.startsWith(
      META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY("")
    ) &&
    permissions.includes(USER_PERMISSIONS.CAN_ACCESS_ALL_ENTITIES)
  ) {
    return true;
  }

  const can = permissions.includes(requiredPermission);
  if (can) {
    return can;
  }

  // TODO on permission heirachy, CAN_RESET_PASSWORD > CAN_MANAGE_USER
  // CAN_MANAGE_CREDENTIALS => CAN_CONFIGURE_APP

  return false;
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
      META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY("")
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
