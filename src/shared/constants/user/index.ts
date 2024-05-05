import { SystemRoles } from "shared/types/user";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { sluggify } from "shared/lib/strings";
import { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/macro";
import { APPLIED_CAN_ACCESS, NO_PERMISSION_REQUIRED } from "./shared";

export const CAN_ACCESS_ENTITY = "CAN_ACCESS_ENTITY";

export const isSystemRole = (roleId: string) => {
  return (Object.values(SystemRoles) as string[]).includes(roleId);
};

export const makeRoleId = (roleName: string) => {
  return sluggify(roleName);
};

export const roleLabel = (value: string) => {
  return value === SystemRoles.Creator
    ? "Super Admin"
    : userFriendlyCase(value);
};

export const META_USER_PERMISSIONS = {
  APPLIED_CAN_ACCESS_ENTITY: APPLIED_CAN_ACCESS(CAN_ACCESS_ENTITY),
  NO_PERMISSION_REQUIRED,
};

export enum UserPermissions {
  CAN_MANAGE_USERS = "CAN_MANAGE_USERS",
  CAN_CONFIGURE_APP = "CAN_CONFIGURE_APP",
  CAN_RESET_PASSWORD = "CAN_RESET_PASSWORD",
  CAN_MANAGE_DASHBOARD = "CAN_MANAGE_DASHBOARD",
  CAN_MANAGE_APP_CREDENTIALS = "CAN_MANAGE_APP_CREDENTIALS",
  CAN_MANAGE_PERMISSIONS = "CAN_MANAGE_PERMISSIONS",
  CAN_MANAGE_ALL_ENTITIES = "CAN_MANAGE_ALL_ENTITIES",
}

export const USER_PERMISSIONS_CONFIG: Record<
  UserPermissions,
  { label: MessageDescriptor; order: number }
> = {
  [UserPermissions.CAN_MANAGE_APP_CREDENTIALS]: {
    label: msg`Can Manage App Credentials`,
    order: 70,
  },
  [UserPermissions.CAN_CONFIGURE_APP]: {
    label: msg`Can Configure App`,
    order: 60,
  },
  [UserPermissions.CAN_MANAGE_ALL_ENTITIES]: {
    label: msg`Can Manage All Entities`,
    order: 50,
  },
  [UserPermissions.CAN_RESET_PASSWORD]: {
    label: msg`Can Reset Password`,
    order: 40,
  },
  [UserPermissions.CAN_MANAGE_USERS]: {
    label: msg`Can Manage Users`,
    order: 30,
  },
  [UserPermissions.CAN_MANAGE_DASHBOARD]: {
    label: msg`Can Manage Dashboard`,
    order: 20,
  },
  [UserPermissions.CAN_MANAGE_PERMISSIONS]: {
    label: msg`Can Manage Permissions`,
    order: 10,
  },
};
