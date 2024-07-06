import {
  CAN_ACCESS_ENTITY,
  META_USER_PERMISSIONS,
  UserPermissions,
} from "shared/constants/user";
import { replaceGranular } from "shared/constants/user/shared";
import { GranularEntityPermissions, SystemRoles } from "shared/types/user";

import { portalMetaPermissionCheck } from "./portal";

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
  requiredPermission: string,
  checkGranular: boolean
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

  const portalMetaPermissionCheckResponse = portalMetaPermissionCheck(
    doMetaPermissionCheck$1
  );

  if (typeof portalMetaPermissionCheckResponse === "boolean") {
    return portalMetaPermissionCheckResponse;
  }

  const entitiesMetaCheck = doMetaPermissionCheck$1(
    CAN_ACCESS_ENTITY,
    UserPermissions.CAN_MANAGE_ALL_ENTITIES
  );

  if (typeof entitiesMetaCheck === "boolean") {
    return entitiesMetaCheck;
  }

  if (requiredPermission.startsWith(CAN_ACCESS_ENTITY) && !checkGranular) {
    // eslint-disable-next-line no-param-reassign
    requiredPermission = replaceGranular(
      requiredPermission,
      GranularEntityPermissions.Show
    );
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
    return requiredPermission.startsWith(CAN_ACCESS_ENTITY);
  }
};

export const canRoleDoThisAsync = async (
  userRole: string,
  permission: string,
  checkGranular: boolean,
  getRolePermission: (role: string) => Promise<string[]>
): Promise<boolean> => {
  const systemRoleCheck = doSystemRoleCheck(userRole, permission);

  if (typeof systemRoleCheck === "boolean") {
    return systemRoleCheck;
  }

  const rolePermissions = await getRolePermission(userRole);

  return doesPermissionAllowPermission(
    rolePermissions,
    permission,
    checkGranular
  );
};

export const canRoleDoThisSync = (
  userRole: string,
  permission: string,
  rolePermissions: string[],
  checkGranular = false
): boolean => {
  const systemRoleCheck = doSystemRoleCheck(userRole, permission);

  if (typeof systemRoleCheck === "boolean") {
    return systemRoleCheck;
  }

  return doesPermissionAllowPermission(
    rolePermissions,
    permission,
    checkGranular
  );
};
