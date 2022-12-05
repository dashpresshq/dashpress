import { StringUtils, SLUG_LOADING_VALUE } from "@hadmean/protozoa";

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
  preferences?: string;
  password: string;
  role: string;
}

export type IAccountProfile = Omit<IAccountUser, "password">;

export interface IAuthenticatedUserBag extends IAccountProfile {
  permissions: string[];
}

export type IUserPreferences = {
  theme: "light" | "dark";
};

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
  CAN_MANAGE_DASHBOARD: "CAN_MANAGE_DASHBOARD",
  CAN_MANAGE_INTEGRATIONS: "CAN_MANAGE_INTEGRATIONS",
  CAN_MANAGE_PERMISSIONS: "CAN_MANAGE_PERMISSIONS",
  CAN_ACCESS_ALL_ENTITIES:
    META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY("ALL_ENTITIES"), // TODO hiding from view i.e merging it wuth hiding entities
};
