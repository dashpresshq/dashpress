export enum AccountRole {
  Creator = "creator",
  viewer = "viewer",
}

export interface IAccountUser {
  name: string;
  username: string;
  systemProfile?: string;
  password: string;
  role: AccountRole;
}

// Delete

/*
 Roles
 Permissions Group
*/

export const USER_PERMISSIONS = {
  CAN_MANAGE_USER: 1,
  CAN_RESET_PASSWORD: 1,
};
