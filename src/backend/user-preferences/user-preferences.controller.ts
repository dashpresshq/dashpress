import {
  USER_PREFERENCES_CONFIG,
  UserPreferencesKeys,
  UserPreferencesValueType,
} from "shared/user-preferences/constants";
import { BadRequestError } from "backend/lib/errors";
import {
  UserPreferencesApiService,
  userPreferencesApiService,
} from "./user-preferences.service";

export class UserPreferenceApiController {
  constructor(private _userPreferencesApiService: UserPreferencesApiService) {}

  async show(username: string, key: string) {
    return {
      data: await this._userPreferencesApiService.show(
        username,
        this.validateUserPreferencesKeys(key)
      ),
    };
  }

  async upsert<T extends UserPreferencesKeys>(
    username: string,
    key: T,
    value: UserPreferencesValueType<T>
  ) {
    await this._userPreferencesApiService.upsert(
      username,
      this.validateUserPreferencesKeys(key),
      value
    );
  }

  private validateUserPreferencesKeys(key: string) {
    const configBag = USER_PREFERENCES_CONFIG[key];
    if (!configBag) {
      throw new BadRequestError(`User Preference key '${key}' doesn't exist`);
    }

    return key as UserPreferencesKeys;
  }
}

export const userPreferenceApiController = new UserPreferenceApiController(
  userPreferencesApiService
);
