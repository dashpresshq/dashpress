import { UnauthorizedError } from "backend/lib/errors";
import { RolesApiService, rolesApiService } from "backend/roles/roles.service";
import { REQUEST_ERROR_CODES } from "shared/constants/auth";
import { ISignInForm } from "shared/form-schemas/auth/signin";
import { ISuccessfullAuthenticationResponse } from "shared/types/auth/portal";
import { IAuthenticatedUserBag } from "shared/types/user";
import { UsersApiService, usersApiService } from "./users.service";

export class UsersApiController {
  constructor(
    private _usersService: UsersApiService,
    private _rolesService: RolesApiService
  ) {}

  async login(
    authCredentials: ISignInForm
  ): Promise<ISuccessfullAuthenticationResponse> {
    return await this._usersService.tryAuthenticate(authCredentials);
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
      throw new UnauthorizedError(
        error.message,
        REQUEST_ERROR_CODES.NOT_AUTHENTICATED
      );
    }
  }
}

export const usersApiController = new UsersApiController(
  usersApiService,
  rolesApiService
);
