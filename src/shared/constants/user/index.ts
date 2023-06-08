import { StringUtils } from "@hadmean/protozoa";
import { userFriendlyCase } from "shared/lib/strings";
import { SystemRoles } from "shared/types/user";
import { PORTAL_USER_PERMISSIONS } from "../portal/user";
import { APPLIED_CAN_ACCESS, NO_PERMISSION_REQUIRED } from "./shared";

export const CAN_ACCESS_ENTITY = "CAN_ACCESS_ENTITY";

export const isSystemRole = (roleId: string) => {
  return (Object.values(SystemRoles) as string[]).includes(roleId);
};

export const makeRoleId = (roleName: string) => {
  return StringUtils.sluggify(roleName);
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

export const BASE_USER_PERMISSIONS = {
  CAN_MANAGE_USERS: "CAN_MANAGE_USERS",
  CAN_CONFIGURE_APP: "CAN_CONFIGURE_APP",
  CAN_RESET_PASSWORD: "CAN_RESET_PASSWORD",
  CAN_MANAGE_DASHBOARD: "CAN_MANAGE_DASHBOARD",
  CAN_MANAGE_INTEGRATIONS: "CAN_MANAGE_INTEGRATIONS",
  CAN_MANAGE_PERMISSIONS: "CAN_MANAGE_PERMISSIONS",
  CAN_MANAGE_ALL_ENTITIES: "CAN_MANAGE_ALL_ENTITIES", // TODO hiding from view i.e merging it wuth hiding entities
};

export const USER_PERMISSIONS = {
  ...BASE_USER_PERMISSIONS,
  ...PORTAL_USER_PERMISSIONS,
};
