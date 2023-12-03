import { AbstractConfigDataPersistenceService } from "backend/lib/config-persistence";
import { BadRequestError, UnauthorizedError } from "backend/lib/errors";
import { HashService } from "backend/lib/hash/hash.service";
import { IApplicationService } from "backend/types";
import { IAccountUser, IAccountProfile } from "shared/types/user";
import { ISuccessfullAuthenticationResponse } from "shared/types/auth/portal";
import { getPortalAuthenticationResponse } from "./portal";
import { generateAuthTokenForUsername } from "./utils";
import { usersPersistenceService } from "./shared";

const INVALID_LOGIN_MESSAGE = "Invalid Login";

export class UsersApiService implements IApplicationService {
  constructor(
    private readonly _usersPersistenceService: AbstractConfigDataPersistenceService<IAccountUser>
  ) {}

  async tryAuthenticate(authCredentials: {
    username: string;
    password: string;
  }): Promise<ISuccessfullAuthenticationResponse> {
    try {
      await this.checkUserPassword(authCredentials);
      return await getPortalAuthenticationResponse(
        authCredentials.username,
        () => generateAuthTokenForUsername(authCredentials.username)
      );
    } catch (error) {
      throw new UnauthorizedError(INVALID_LOGIN_MESSAGE);
    }
  }

  async bootstrap() {
    await this._usersPersistenceService.setup();
  }

  async registerUser(user: IAccountUser) {
    const userExists = await this._usersPersistenceService.getItem(
      user.username
    );
    if (userExists) {
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

    return users.map((user) => {
      const userCopy = { ...user };
      delete userCopy.password;

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

  async getUser(username: string): Promise<IAccountProfile> {
    const user = await this._usersPersistenceService.getItemOrFail(username);
    delete user.password;
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
    if (process.env.NEXT_PUBLIC_IS_DEMO) {
      return;
    }

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

  async resetPassword(username: string, newPassword: string) {
    if (process.env.NEXT_PUBLIC_IS_DEMO) {
      return;
    }
    await this.updateUser(username, {
      password: await HashService.make(newPassword),
    });
  }

  async updateUser(username: string, userDetails: Partial<IAccountUser>) {
    const user = await this._usersPersistenceService.getItemOrFail(username);
    if (!user) {
      return;
    }
    await this._usersPersistenceService.updateItem(username, {
      ...user,
      ...userDetails,
    });
  }
}

export const usersApiService = new UsersApiService(usersPersistenceService);
