import { AccountRole } from "backend/users/users.types";

export interface IAccountUser {
  name: string;
  username: string;
  systemId?: string;
  role: AccountRole;
}
