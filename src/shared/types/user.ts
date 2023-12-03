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

export type IAccountProfile = Omit<IAccountUser, "password">;

export interface IAuthenticatedUserBag extends IAccountProfile {
  permissions: string[];
}

export enum GranularEntityPermissions {
  Show = "show",
  Create = "create",
  Update = "update",
  Delete = "delete",
}
