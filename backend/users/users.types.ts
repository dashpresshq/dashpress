export enum UserRole {
  Creator = "creator",
  viewer = "viewer",
}

export interface IUser {
  name: string;
  username: string;
  password: string;
  systemId?: string;
  role: UserRole;
}
