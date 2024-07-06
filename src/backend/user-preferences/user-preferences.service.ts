import { BadRequestError } from "backend/lib/errors";
import type {
  UserPreferencesKeys,
  UserPreferencesValueType,
} from "shared/user-preferences/constants";
import { USER_PREFERENCES_CONFIG } from "shared/user-preferences/constants";

import type { AbstractConfigDataPersistenceService } from "../lib/config-persistence";
import { createConfigDomainPersistenceService } from "../lib/config-persistence";

export class UserPreferencesApiService {
  constructor(
    private _userPreferencesPersistenceService: AbstractConfigDataPersistenceService<unknown>
  ) {}

  private makeId({
    key,
    username,
  }: {
    username: string;
    key: UserPreferencesKeys;
  }) {
    return this._userPreferencesPersistenceService.mergeKeyWithSecondaryKey(
      username,
      key
    );
  }

  async show<T extends UserPreferencesKeys>(
    username: string,
    key: T
  ): Promise<{ data: UserPreferencesValueType<T> }> {
    return {
      data: (await this._userPreferencesPersistenceService.getItem(
        this.makeId({
          key: this.validateUserPreferencesKeys(key),
          username,
        }),
        USER_PREFERENCES_CONFIG[key].defaultValue
      )) as UserPreferencesValueType<T>,
    };
  }

  async upsert<T extends UserPreferencesKeys>(
    username: string,
    key: T,
    value: UserPreferencesValueType<T>
  ): Promise<void> {
    return await this._userPreferencesPersistenceService.upsertItem(
      this.makeId({
        key: this.validateUserPreferencesKeys(key),
        username,
      }),
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

const userPreferencesPersistenceService =
  createConfigDomainPersistenceService("users-preferences");

export const userPreferencesApiService = new UserPreferencesApiService(
  userPreferencesPersistenceService
);
