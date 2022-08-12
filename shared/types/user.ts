import { StringUtils, SLUG_LOADING_VALUE } from "@gothicgeeks/shared";

export enum SystemRoles {
  Creator = "creator",
  Viewer = "viewer",
}

export const isSystemRole = (roleId: string) => {
  return (Object.values(SystemRoles) as string[]).includes(roleId);
};

export const makeRoleId = (roleName: string) => {
  return StringUtils.sluggify(roleName);
};

export interface IAccountUser {
  name: string;
  username: string;
  systemProfile?: string;
  password: string;
  role: string;
}

export interface IAuthenticatedUserBag extends Omit<IAccountUser, "password"> {
  permissions: string[];
}

const CAN_ACCESS_ENTITY = "CAN_ACCESS_ENTITY";
const NO_PERMISSION_REQUIRED = "NO_PERMISSION_REQUIRED";

export const META_USER_PERMISSIONS = {
  APPLIED_CAN_ACCESS_ENTITY: (entity: string) => {
    if (entity === SLUG_LOADING_VALUE) {
      return NO_PERMISSION_REQUIRED;
    }
    return `${CAN_ACCESS_ENTITY}:${entity.toUpperCase()}`;
  },
  NO_PERMISSION_REQUIRED,
};

export const USER_PERMISSIONS = {
  CAN_MANAGE_USER: "CAN_MANAGE_USER",
  CAN_CONFIGURE_APP: "CAN_CONFIGURE_APP",
  CAN_RESET_PASSWORD: "CAN_RESET_PASSWORD",
  CAN_MANAGE_PERMISSIONS: "CAN_MANAGE_PERMISSIONS",
  CAN_ACCESS_ALL_ENTITIES:
    META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY("ALL_ENTITIES"),
};

const doesPermissionAllowPermission = (
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

  return permissions.includes(requiredPermission);
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

export const canRoleDoThis = async (
  userRole: string,
  permission: string,
  getRolePermission: (role: string) => Promise<string[]> | string[]
): Promise<boolean> => {
  const systemRoleCheck = doSystemRoleCheck(userRole, permission);

  if (typeof systemRoleCheck === "boolean") {
    return systemRoleCheck;
  }

  const rolePermissions = await getRolePermission(userRole);

  return doesPermissionAllowPermission(rolePermissions, permission);
};
