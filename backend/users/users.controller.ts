import { UsersService, usersService } from "./users.service";
import { IUser } from "./users.types";

export interface IAuthCredentials {
  username: string;
  password: string;
}

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}

export type ICreateUser = Pick<
  IUser,
  "name" | "password" | "role" | "username"
>;

export type IUpdateUserByCreator = Pick<IUser, "role" | "systemId">;

export class UsersController {
  constructor(private _usersService: UsersService) {}

  async login(authCrendetials: IAuthCredentials) {
    return await this._usersService.tryAuthenticate(authCrendetials);
  }

  async createUser(user: IUser) {
    await this._usersService.registerUser(user);
  }

  async removeUser(username: string) {
    await this._usersService.removeUser(username);
  }

  async getUserProfile(username: string) {
    await this._usersService.getUser(username);
  }

  async resetPassword(username: string, password: string) {
    await this._usersService.resetPassword(username, password);
  }

  async updatePassword(username: string, input: IChangePassword) {
    await this._usersService.changePassword(username, input);
  }

  async updateProfile(username: string, userDetails: IUser) {
    await this._usersService.updateUser(username, userDetails);
  }
}

export const usersController = new UsersController(usersService);
