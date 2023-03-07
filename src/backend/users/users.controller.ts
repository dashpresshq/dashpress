import { ForbiddenError } from "backend/lib/errors";
import { RolesService, rolesService } from "backend/roles/roles.service";
import { REQUEST_ERROR_CODES } from "shared/constants/auth";
import { ISignInForm } from "shared/form-schemas/auth/signin";
import { IChangePasswordForm } from "shared/form-schemas/profile/password";
import { IResetPasswordForm } from "shared/form-schemas/users/reset-password";
import {
  IAccountProfile,
  IAccountUser,
  IAuthenticatedUserBag,
  IUserPreferences,
} from "shared/types/user";
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

  async removeUser(username: string, myUsername: string) {
    await this._usersService.removeUser(username, myUsername);
  }

  async getUserProfile(username: string) {
    return await this._usersService.getUser(username);
  }

  async getAuthenticatedUserBag(
    authenticatedUsername: string
  ): Promise<IAuthenticatedUserBag> {
    try {
      const profile = await this._usersService.getUser(authenticatedUsername);
      const permissions = await this._rolesService.getRolePermissions(
        profile.role
      );
      return {
        ...profile,
        permissions,
      };
    } catch (error) {
      /*
        Any error here should make the user redirect to login page
      */
      throw new ForbiddenError(
        error.message,
        REQUEST_ERROR_CODES.NOT_AUTHENTICATED
      );
    }
  }

  async resetPassword(username: string, input: IResetPasswordForm) {
    await this._usersService.resetPassword(username, input.password);
  }

  async updatePassword(username: string, input: IChangePasswordForm) {
    await this._usersService.changePassword(username, input);
  }

  async updateProfile(username: string, userDetails: IAccountProfile) {
    await this._usersService.updateUser(username, userDetails);
  }

  async updateUserPreferences(
    authenticatedUsername: string,
    userPreferences: Partial<IUserPreferences>
  ) {
    const profile = await this._usersService.getUser(authenticatedUsername);

    const previousPreferences: Partial<IUserPreferences> = profile.preferences
      ? JSON.parse(profile.preferences)
      : {};

    await this._usersService.updateUser(authenticatedUsername, {
      preferences: JSON.stringify({
        ...previousPreferences,
        ...userPreferences,
      }),
    });
  }
}

export const usersController = new UsersController(usersService, rolesService);
