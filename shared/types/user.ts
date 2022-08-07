export enum AccountRole {
  Creator = "creator",
  Viewer = "viewer",
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
  CAN_MANAGE_USER: "CAN_MANAGE_USER",
  CAN_RESET_PASSWORD: "CAN_RESET_PASSWORD",
  CAN_MANAGE_PERMISSIONS: "CAN_MANAGE_PERMISSIONS",
};

// Must not be empty when deleting
// Create, Update, Delete, List, Details permission group

// Assign permisson

// Un-assign permission

// list group permissions
