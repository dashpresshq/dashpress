import {
  USER_PREFERENCES_CONFIG,
  UserPreferencesKeys,
  UserPreferencesValueType,
} from "shared/user-preferences/constants";
import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "../lib/config-persistence";

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
  ): Promise<UserPreferencesValueType<T>> {
    return (await this._userPreferencesPersistenceService.getItem(
      this.makeId({
        key,
        username,
      }),
      USER_PREFERENCES_CONFIG[key].defaultValue
    )) as UserPreferencesValueType<T>;
  }

  async upsert<T extends UserPreferencesKeys>(
    username: string,
    key: T,
    value: UserPreferencesValueType<T>
  ): Promise<void> {
    return await this._userPreferencesPersistenceService.upsertItem(
      this.makeId({
        key,
        username,
      }),
      value
    );
  }
}

const userPreferencesPersistenceService =
  createConfigDomainPersistenceService("users-preferences");

export const userPreferencesApiService = new UserPreferencesApiService(
  userPreferencesPersistenceService
);
