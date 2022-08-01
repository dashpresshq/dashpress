import { UsersService, usersService } from "./users.service";
import { IAccountUser } from "./users.types";

export interface IAuthCredentials {
  username: string;
  password: string;
}

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}

export type ICreateUser = Pick<
  IAccountUser,
  "name" | "password" | "role" | "username"
>;

export type IUpdateUserByCreator = Pick<IAccountUser, "role" | "systemId">;

export type IAccountProfile = Omit<IAccountUser, "password">;

export class UsersController {
  constructor(private _usersService: UsersService) {}

  async login(authCrendetials: IAuthCredentials) {
    return await this._usersService.tryAuthenticate(authCrendetials);
  }

  async createUser(user: IAccountUser) {
    await this._usersService.registerUser(user);
  }

  async removeUser(username: string) {
    await this._usersService.removeUser(username);
  }

  async getUserProfile(username: string): Promise<IAccountProfile> {
    const user = await this._usersService.getUser(username);
    delete user.password;
    return user;
  }

  async resetPassword(username: string, password: string) {
    await this._usersService.resetPassword(username, password);
  }

  async updatePassword(username: string, input: IChangePassword) {
    await this._usersService.changePassword(username, input);
  }

  async updateProfile(username: string, userDetails: IAccountUser) {
    await this._usersService.updateUser(username, userDetails);
  }
}

export const usersController = new UsersController(usersService);
