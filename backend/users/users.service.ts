import { createConfigDomainPersistenceService } from "backend/lib/config-data";
import { AbstractConfigDataPersistenceService } from "backend/lib/config-data/AbstractConfigDataPersistenceService";
import { BadRequestError, ForbiddenError } from "backend/lib/errors";
import { HashService } from "backend/lib/hash/hash.service";
import { IUser } from "./users.types";

// users and update only
// name, password
// admins can update all those expect username

// TODO setup a random JWT_SERVICE_TOKEN on setup in the credentials

const INVALID_LOGIN_MESSAGE = "Invalid Login";

export class UsersService {
  constructor(
    private _usersPersistenceService: AbstractConfigDataPersistenceService<IUser>
  ) {}

  async tryAuthenticate(authCrendetials: {
    username: string;
    password: string;
  }) {
    const user = await this._usersPersistenceService.getItem(
      authCrendetials.username
    );

    if (!user) {
      throw new ForbiddenError(INVALID_LOGIN_MESSAGE);
    }
    if (!(await HashService.compare(authCrendetials.password, user.password))) {
      throw new ForbiddenError(INVALID_LOGIN_MESSAGE);
    }
    delete user.password; // :eyes
    // return JWTService.foo(user); TODO
  }

  async registerUser(user: IUser) {
    const userExists = await this._usersPersistenceService.getItem(
      user.username
    );
    if (userExists) {
      throw new BadRequestError("Username already exists");
    }
    await this._usersPersistenceService.upsertItem(user.username, user);
  }

  async removeUser(username: string) {
    await this._usersPersistenceService.removeItem(username);
  }

  async changePassword(input: {
    username: string;
    oldPassword: string;
    newPassword: string;
  }) {
    const user = await this._usersPersistenceService.getItem(input.username);

    if (!(await HashService.compare(input.oldPassword, user.password))) {
      throw new BadRequestError("Incorrect password");
    }
    await this.updateUser(input.username, {
      password: await HashService.make(input.newPassword),
    });
  }

  async resetPassword(username: string, newPassword: string) {
    await this.updateUser(username, {
      password: await HashService.make(newPassword),
    });
  }

  async updateUser(username: string, userDetails: Partial<IUser>) {
    const user = await this._usersPersistenceService.getItem(username);
    if (!user) {
      return;
    }
    await this._usersPersistenceService.upsertItem(username, {
      ...user,
      ...userDetails,
    });
  }
}

const usersPersistenceService =
  createConfigDomainPersistenceService<IUser>("users");

export const usersService = new UsersService(usersPersistenceService);
