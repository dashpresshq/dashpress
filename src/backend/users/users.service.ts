import type { ConfigurationApiService } from "backend/configuration/configuration.service";
import { configurationApiService } from "backend/configuration/configuration.service";
import type { RDBMSDataApiService } from "backend/data/data-access/RDBMS";
import { rDBMSDataApiService } from "backend/data/data-access/RDBMS";
import type { AbstractConfigDataPersistenceService } from "backend/lib/config-persistence";
import { BadRequestError, UnauthorizedError } from "backend/lib/errors";
import { HashService } from "backend/lib/hash/hash.service";
import type { IResetPasswordForm } from "shared/form-schemas/users/reset-password";
import { noop } from "shared/lib/noop";
import type { ISuccessfullAuthenticationResponse } from "shared/types/auth/portal";
import type { IAccountProfile, IAccountUser } from "shared/types/user";

import { authTokenApiService } from "../lib/auth-token/auth-token.service";
import { getPortalAuthenticationResponse } from "./portal";
import { usersPersistenceService } from "./shared";

const INVALID_LOGIN_MESSAGE = "Invalid Login";

export class UsersApiService {
  constructor(
    private readonly _usersPersistenceService: AbstractConfigDataPersistenceService<IAccountUser>,
    private readonly _configurationApiService: ConfigurationApiService,
    private _rDBMSApiDataService: RDBMSDataApiService
  ) {}

  async tryAuthenticate(authCredentials: {
    username: string;
    password: string;
  }): Promise<ISuccessfullAuthenticationResponse> {
    try {
      await this.checkUserPassword(authCredentials);
      return await getPortalAuthenticationResponse(
        authCredentials.username,
        () => this.generateAuthTokenForUsername(authCredentials.username)
      );
    } catch (error) {
      throw new UnauthorizedError(INVALID_LOGIN_MESSAGE);
    }
  }

  async generateAuthTokenForUsername(
    username: string
  ): Promise<ISuccessfullAuthenticationResponse> {
    return {
      token: await authTokenApiService.sign(
        await this.getAccountProfile(username)
      ),
    };
  }

  async registerUser(user: IAccountUser) {
    if (await this._usersPersistenceService.hasItem(user.username)) {
      throw new BadRequestError("Username already exists");
    }
    await this._usersPersistenceService.createItem(user.username, {
      ...user,
      password: await HashService.make(user.password),
    });
  }

  async hasUsers() {
    return (await this._usersPersistenceService.getAllItems()).length > 0;
  }

  async listUsers() {
    const users = await this._usersPersistenceService.getAllItems();

    return users.map(({ password, ...userCopy }) => {
      noop(password);
      return userCopy;
    });
  }

  async removeUser(username: string, myUsername: string) {
    if (username === myUsername) {
      throw new BadRequestError("Can't delete your account");
    }
    if (username === "root") {
      throw new BadRequestError("Can't delete root account");
    }
    await this._usersPersistenceService.removeItem(username);
  }

  async getAccountProfile(username: string): Promise<IAccountProfile> {
    const { password, ...user } =
      await this._usersPersistenceService.getItemOrFail(username);
    noop(password);
    return user;
  }

  async checkUserPassword({
    password,
    username,
  }: {
    username: string;
    password: string;
  }) {
    const user = await this._usersPersistenceService.getItemOrFail(username);

    if (!(await HashService.compare(password, user.password))) {
      throw new Error();
    }

    return user;
  }

  async changePassword(
    username: string,
    input: {
      oldPassword: string;
      newPassword: string;
    }
  ) {
    try {
      await this.checkUserPassword({
        username,
        password: input.oldPassword,
      });
    } catch (error) {
      throw new BadRequestError("Incorrect password");
    }

    await this.updateUser(username, {
      password: await HashService.make(input.newPassword),
    });
  }

  async resetPassword(username: string, newPassword: IResetPasswordForm) {
    await this.updateUser(username, {
      password: await HashService.make(newPassword.password),
    });
  }

  async updateUser(username: string, userDetails: Partial<IAccountUser>) {
    const user = await this._usersPersistenceService.getItemOrFail(username);

    await this._usersPersistenceService.upsertItem(username, {
      ...user,
      ...userDetails,
    });
  }

  async getUserDatabaseLinkedInfo(
    auth: IAccountProfile
  ): Promise<IAccountProfile> {
    const databaseLink = await this._configurationApiService.show(
      "users_to_database_link"
    );

    if (!databaseLink.table) {
      return auth;
    }

    const databaseUser = await this._rDBMSApiDataService.read<
      Record<string, unknown>
    >(
      databaseLink.table,
      ["*"],
      this._rDBMSApiDataService.whereEqualQueryFilterSchema(
        databaseLink.field,
        auth.username
      )
    );

    return { ...databaseUser, ...auth };
  }
}

export const usersApiService = new UsersApiService(
  usersPersistenceService,
  configurationApiService,
  rDBMSDataApiService
);
