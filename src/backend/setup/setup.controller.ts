import {
  credentialsService,
  CredentialsService,
  CredentialsGroup,
} from "backend/integrations-configurations";
import { getDbConnection } from "backend/lib/connection/db";
import { BadRequestError } from "backend/lib/errors";
import { usersService, UsersService } from "backend/users/users.service";
import { ISetupCheck } from "shared/types/auth";
import { IAccountUser, SystemRoles } from "shared/types/user";
import { IDataSourceCredentials } from "shared/types/data-sources";

export type IAccountUserSetupFields = Pick<
  IAccountUser,
  "name" | "username" | "password"
>;

export class SetupController {
  constructor(
    private _usersService: UsersService,
    private _credentialsService: CredentialsService
  ) {}

  async check(): Promise<ISetupCheck> {
    const [hasDbCredentials, hasUsers] = await Promise.all([
      this._credentialsService.hasGroupKey(CredentialsGroup.DATABASE),
      this._usersService.hasUsers(),
    ]);

    return {
      hasDbCredentials,
      hasUsers,
    };
  }

  async setUpFirstUser(user: IAccountUserSetupFields) {
    if (await this._usersService.hasUsers()) {
      throw new BadRequestError("Primary user already setup");
    }

    await this._usersService.registerUser({
      ...user,
      role: SystemRoles.Creator,
    });

    return await this._usersService.tryAuthenticate(user);
  }

  async setUpDBCredentials(dbCredentials: IDataSourceCredentials) {
    if (await this._credentialsService.hasGroupKey(CredentialsGroup.DATABASE)) {
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

    await this._credentialsService.upsertGroup(
      CredentialsGroup.DATABASE,
      dbCredentials as unknown as Record<string, string>
    );
  }
}

export const setupController = new SetupController(
  usersService,
  credentialsService
);
