import { UsersService, usersService } from "./users.service";
import { IUser } from "./users.types";

export class UsersController {
  constructor(private _usersService: UsersService) {}

  async login(authCrendetials: { username: string; password: string }) {
    return await this._usersService.tryAuthenticate(authCrendetials);
  }

  async createUser(user: IUser) {
    await this._usersService.registerUser(user);
  }

  async removeUser(username: string) {
    await this._usersService.removeUser(username);
  }

  async resetPassword(username: string, password: string) {
    await this._usersService.resetPassword(username, password);
  }

  async updatePassword(input: {
    username: string;
    oldPassword: string;
    newPassword: string;
  }) {
    await this._usersService.changePassword(input);
  }

  async updateProfile(username: string, userDetails: IUser) {
    await this._usersService.updateUser(username, userDetails);
  }
}

export const usersController = new UsersController(usersService);
