import {
  credentialsService,
  CredentialsService,
} from "backend/credentials/credentials.service";
import { CREDENTIALS_DOMAINS } from "backend/credentials/crendential.types";
import { getKnexConnection } from "backend/lib/connection/db";
import { BadRequestError } from "backend/lib/errors";
import { usersService, UsersService } from "backend/users/users.service";
import {
  IAccountUser,
  SystemRoles,
  IDBCredentials,
  ISetupCheck,
} from "shared/types";

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
      this._credentialsService.hasDomainCredentials(
        CREDENTIALS_DOMAINS.database
      ),
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

  async setUpDBCredentials(dbCredentials: IDBCredentials) {
    if (
      await this._credentialsService.hasDomainCredentials(
        CREDENTIALS_DOMAINS.database
      )
    ) {
      throw new BadRequestError(
        "Primary database credentials already configured"
      );
    }

    try {
      await getKnexConnection(dbCredentials);
    } catch (error: unknown) {
      throw new BadRequestError(
        `Couldn't not connect to database '${(error as Error).message}'`
      );
    }

    await this._credentialsService.upsertDomainCredentials(
      CREDENTIALS_DOMAINS.database,
      dbCredentials
    );
  }
}

export const setupController = new SetupController(
  usersService,
  credentialsService
);
