import { StringUtils } from "@gothicgeeks/shared";

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

export const APPLIED_CAN_ACCESS_ENTITY = (entity: string) =>
  `${CAN_ACCESS_ENTITY}:${entity.toUpperCase()}`;

export const USER_PERMISSIONS = {
  CAN_MANAGE_USER: "CAN_MANAGE_USER",
  CAN_CONFIGURE_APP: "CAN_CONFIGURE_APP",
  CAN_RESET_PASSWORD: "CAN_RESET_PASSWORD",
  CAN_MANAGE_PERMISSIONS: "CAN_MANAGE_PERMISSIONS",
  CAN_ACCESS_ALL_ENTITIES: APPLIED_CAN_ACCESS_ENTITY("ALL_ENTITIES"),
};
