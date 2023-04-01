import {
  credentialsApiService,
  CredentialsApiService,
} from "backend/integrations-configurations";
import { getDbConnection } from "backend/lib/connection/db";
import { BadRequestError } from "backend/lib/errors";
import { usersApiService, UsersApiService } from "backend/users/users.service";
import { ISetupCheck } from "shared/types/auth";
import { IAccountUser, SystemRoles } from "shared/types/user";
import { IDataSourceCredentials } from "shared/types/data-sources";
import { DATABASE_CREDENTIAL_GROUP } from "backend/data/fields";

export type IAccountUserSetupFields = Pick<
  IAccountUser,
  "name" | "username" | "password"
>;

export class SetupApiController {
  constructor(
    private _usersApiService: UsersApiService,
    private _credentialsApiService: CredentialsApiService
  ) {}

  async check(): Promise<ISetupCheck> {
    const [hasDbCredentials, hasUsers] = await Promise.all([
      this._credentialsApiService.hasGroupKey(DATABASE_CREDENTIAL_GROUP),
      this._usersApiService.hasUsers(),
    ]);

    return {
      hasDbCredentials,
      hasUsers,
    };
  }

  async setUpFirstUser(user: IAccountUserSetupFields) {
    if (await this._usersApiService.hasUsers()) {
      throw new BadRequestError("Primary user already setup");
    }

    await this._usersApiService.registerUser({
      ...user,
      role: SystemRoles.Creator,
    });

    return await this._usersApiService.tryAuthenticate(user);
  }

  async setUpDBCredentials(dbCredentials: IDataSourceCredentials) {
    if (
      await this._credentialsApiService.hasGroupKey(DATABASE_CREDENTIAL_GROUP)
    ) {
      throw new BadRequestError(
        "Primary database credentials already configured"
      );
    }

    try {
      await getDbConnection(dbCredentials);
    } catch (error: unknown) {
      throw new BadRequestError(
        `Couldn't not connect to database '${(error as Error).message}'`
      );
    }

    await this._credentialsApiService.upsertGroup(
      DATABASE_CREDENTIAL_GROUP,
      dbCredentials as unknown as Record<string, string>
    );
  }
}

export const setupApiController = new SetupApiController(
  usersApiService,
  credentialsApiService
);
