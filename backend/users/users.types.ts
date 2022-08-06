export enum AccountRole {
  Creator = "creator",
  viewer = "viewer",
}

export interface IAccountUser {
  name: string;
  username: string;
  password: string;
  systemId?: string;
  role: AccountRole;
}

// Reset Password
// Update Profile, role | systemId | name
// Delete

// Create

/*
 Roles
 Permissions
*/
