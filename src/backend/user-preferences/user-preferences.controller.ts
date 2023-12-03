import { UserPreferencesKeys } from "shared/user-preferences/constants";
import {
  UserPreferencesApiService,
  userPreferencesApiService,
} from "./user-preferences.service";

export class UserPreferenceApiController {
  constructor(private _userPreferencesApiService: UserPreferencesApiService) {}

  async show(username: string, key: UserPreferencesKeys) {
    return await this._userPreferencesApiService.show(username, key);
  }

  async upsert(username: string, key: UserPreferencesKeys, value: unknown) {
    await this._userPreferencesApiService.upsert(username, key, value);
  }
}

export const userPreferenceApiController = new UserPreferenceApiController(
  userPreferencesApiService
);
