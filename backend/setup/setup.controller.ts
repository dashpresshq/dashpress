import {
  credentialsService,
  CredentialsService,
} from "backend/credentials/credentials.service";
import { CREDENTIALS_DOMAINS } from "backend/credentials/crendential.types";
import { BadRequestError } from "backend/lib/errors";
import { usersService, UsersService } from "backend/users/users.service";
import { IUser, UserRole } from "backend/users/users.types";

interface ISetupCheck {
  hasDbCredentials: boolean;
  hasUsers: boolean;
}

export type IUserSetupFields = Pick<IUser, "name" | "username" | "password">;

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

  async setUpFirstUser(user: IUserSetupFields) {
    if (await this._usersService.hasUsers()) {
      throw new BadRequestError("Primary user already setup");
    }

    await this._usersService.registerUser({
      ...user,
      role: UserRole.Creator,
    });

    return await this._usersService.tryAuthenticate(user);
  }

  async setUpDBCredentials(dbCrendetials: Record<string, unknown>) {
    if (
      await this._credentialsService.hasDomainCredentials(
        CREDENTIALS_DOMAINS.database
      )
    ) {
      throw new BadRequestError(
        "Primary database credentials already configured"
      );
    }

    await this._credentialsService.upsertDomainCredentials(
      CREDENTIALS_DOMAINS.database,
      dbCrendetials
    );
  }
}

export const setupController = new SetupController(
  usersService,
  credentialsService
);
