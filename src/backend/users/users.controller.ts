import { UnauthorizedError } from "backend/lib/errors";
import { RolesApiService, rolesApiService } from "backend/roles/roles.service";
import { REQUEST_ERROR_CODES } from "shared/constants/auth";
import { IAuthenticatedUserBag } from "shared/types/user";
import { UsersApiService, usersApiService } from "./users.service";

export class UsersApiController {
  constructor(
    private _usersService: UsersApiService,
    private _rolesService: RolesApiService
  ) {}

  async getAuthenticatedUserBag(
    authenticatedUsername: string
  ): Promise<IAuthenticatedUserBag> {
    try {
      const accountProfile = await this._usersService.getAccountProfile(
        authenticatedUsername
      );
      const [permissions, linkedProfile] = await Promise.all([
        this._rolesService.getRolePermissions(accountProfile.role),
        this._usersService.getUserDatabaseLinkedInfo(accountProfile),
      ]);
      return {
        ...linkedProfile,
        permissions,
      };
    } catch (error) {
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
