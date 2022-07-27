export type UserRole = "creator" | "viewer";

export interface IUser {
  name: string;
  username: string;
  password: string;
  systemId: string;
  role: UserRole;
}
