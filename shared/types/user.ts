export enum SystemRoles {
  Creator = "creator",
  Viewer = "viewer",
}

export interface IAccountUser {
  name: string;
  username: string;
  systemProfile?: string;
  password: string;
  role: string;
}

const CAN_ACCESS_ENTITY = "CAN_ACCESS_ENTITY";

export const APPLIED_CAN_ACCESS_ENTITY = (entity: string) =>
  `${CAN_ACCESS_ENTITY}:${entity.toUpperCase()}`;

export const USER_PERMISSIONS = {
  CAN_MANAGE_USER: "CAN_MANAGE_USER",
  CAN_CONFIGURE_APP: "CAN_CONFIGURE_APP",
  CAN_RESET_PASSWORD: "CAN_RESET_PASSWORD",
  CAN_MANAGE_PERMISSIONS: "CAN_MANAGE_PERMISSIONS",
  CAN_ACCESS_ENTITY,
  CAN_ACCESS_ALL_ENTITIES: APPLIED_CAN_ACCESS_ENTITY("ALL_ENTITIES"),
};
