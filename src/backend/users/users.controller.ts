import { RolesService, rolesService } from "backend/roles/roles.service";
import { ISignInForm } from "shared/form-schemas/auth/signin";
import { IChangePasswordForm } from "shared/form-schemas/profile/password";
import { IResetPasswordForm } from "shared/form-schemas/users/reset-password";
import { IAccountUser, IAuthenticatedUserBag } from "shared/types";
import { UsersService, usersService } from "./users.service";

export class UsersController {
  constructor(
    private _usersService: UsersService,
    private _rolesService: RolesService
  ) {}

  async login(authCredentials: ISignInForm) {
    return await this._usersService.tryAuthenticate(authCredentials);
  }

  async listUsers() {
    return await this._usersService.listUsers();
  }

  async createUser(user: IAccountUser) {
    await this._usersService.registerUser(user);
  }

  async removeUser(username: string) {
    await this._usersService.removeUser(username);
  }

  async getUserProfile(username: string) {
    return await this._usersService.getUser(username);
  }

  async getAuthenticatedUserBag(
    authenticatedUsername: string
  ): Promise<IAuthenticatedUserBag> {
    const profile = await this._usersService.getUser(authenticatedUsername);
    const permissions = await this._rolesService.getRolePermissions(
      profile.role
    );
    return {
      ...profile,
      permissions,
    };
  }

  async resetPassword(username: string, input: IResetPasswordForm) {
    await this._usersService.resetPassword(username, input.password);
  }

  async updatePassword(username: string, input: IChangePasswordForm) {
    await this._usersService.changePassword(username, input);
  }

  async updateProfile(username: string, userDetails: IAccountUser) {
    await this._usersService.updateUser(username, userDetails);
  }
}

export const usersController = new UsersController(usersService, rolesService);
