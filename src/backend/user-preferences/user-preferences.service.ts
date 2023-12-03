import { IApplicationService } from "backend/types";
import {
  USER_PREFERENCES_CONFIG,
  UserPreferencesKeys,
} from "shared/user-preferences/constants";
import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "../lib/config-persistence";

// TODO hidden_entity_table_columns

export class UserPreferencesApiService implements IApplicationService {
  constructor(
    private _userPreferencesPersistenceService: AbstractConfigDataPersistenceService<unknown>
  ) {}

  async bootstrap() {
    await this._userPreferencesPersistenceService.setup();
  }

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

  async show<T>(username: string, key: UserPreferencesKeys): Promise<T> {
    const value = await this._userPreferencesPersistenceService.getItem(
      this.makeId({
        key,
        username,
      })
    );

    if (value) {
      return value as T;
    }

    return USER_PREFERENCES_CONFIG[key].defaultValue as T;
  }

  async upsert(
    username: string,
    key: UserPreferencesKeys,
    value: unknown
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
