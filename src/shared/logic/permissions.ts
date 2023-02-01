import {
  META_USER_PERMISSIONS,
  SystemRoles,
  USER_PERMISSIONS,
} from "shared/types/user";

// TODO
// const PERMISSION_HEIRACHIES = [
//   [USER_PERMISSIONS.CAN_RESET_PASSWORD, USER_PERMISSIONS.CAN_MANAGE_USERS],
//   [
//     USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS,
//     USER_PERMISSIONS.CAN_CONFIGURE_APP,
//   ],
//   [
//     USER_PERMISSIONS.CAN_CONFIGURE_APP,
//     USER_PERMISSIONS.CAN_MANAGE_ALL_ENTITIES,
//   ],
// ];

export const doesPermissionAllowPermission = (
  permissions: string[],
  requiredPermission: string
): boolean => {
  if (
    requiredPermission.startsWith(
      META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY("")
    ) &&
    permissions.includes(USER_PERMISSIONS.CAN_MANAGE_ALL_ENTITIES)
  ) {
    return true;
  }

  const can = permissions.includes(requiredPermission);
  if (can) {
    return can;
  }

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
