import { DATABASE_CREDENTIAL_GROUP } from "@/backend/data/fields";
import type { CredentialsApiService } from "@/backend/integrations-configurations";
import { credentialsApiService } from "@/backend/integrations-configurations";
import { getDbConnection } from "@/backend/lib/connection/db";
import { BadRequestError } from "@/backend/lib/errors";
import type { UsersApiService } from "@/backend/users/users.service";
import { usersApiService } from "@/backend/users/users.service";
import type { ISetupCheck } from "@/shared/types/auth";
import type { IDataSourceCredentials } from "@/shared/types/data-sources";
import type { IAccountUser } from "@/shared/types/user";
import { SystemRoles } from "@/shared/types/user";

export type IAccountUserSetupFields = Pick<
  IAccountUser,
  "name" | "username" | "password"
>;

export class SetupApiService {
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

export const setupApiService = new SetupApiService(
  usersApiService,
  credentialsApiService
);
