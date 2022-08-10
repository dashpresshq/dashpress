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

export const USER_PERMISSIONS = {
  CAN_MANAGE_USER: "CAN_MANAGE_USER",
  CAN_CONFIGURE_APP: "CAN_CONFIGURE_APP",
  CAN_RESET_PASSWORD: "CAN_RESET_PASSWORD",
  CAN_MANAGE_PERMISSIONS: "CAN_MANAGE_PERMISSIONS",
  CAN_VIEW_ENTITY: "CAN_VIEW_ENTITY",
  CAN_VIEW_ENTITY_ALL: "CAN_VIEW_ENTITY:ALL_ENTITIES",
};
