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
  CAN_MANAGE_USER: 1,
  CAN_RESET_PASSWORD: 1,
  CAN_MANAGE_PERMISSIONS: 1,
};

// Must not be empty when deleting
// Create, Update, Delete, List, Details permission group

// Assign permisson

// Un-assign permission

// list group permissions
