import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { StorageService, TemporayStorageService } from "frontend/lib/storage";
import { STORAGE_CONSTANTS } from "frontend/lib/storage/constants";
import { noop } from "shared/lib/noop";

const JWT_TOKEN_STORAGE_KEY = "__auth-token__";

const getAuthToken = (): string | null =>
  TemporayStorageService.getString(JWT_TOKEN_STORAGE_KEY) ||
  StorageService.getString(JWT_TOKEN_STORAGE_KEY);

const isAuthenticated = () => !!getAuthToken();

const removeAuthToken = (): void => {
  StorageService.removeString(JWT_TOKEN_STORAGE_KEY);
  TemporayStorageService.removeString(JWT_TOKEN_STORAGE_KEY);
};

export const AuthActions = {
  JWT_TOKEN_STORAGE_KEY,
  getAuthToken,
  isAuthenticated,
  setAuthToken: (token: string, permanent?: boolean): void => {
    TemporayStorageService.setString(JWT_TOKEN_STORAGE_KEY, token);
    if (permanent) {
      StorageService.setString(JWT_TOKEN_STORAGE_KEY, token);
    }
  },
  removeAuthToken,
  signOut: (from: string) => {
    noop(from);
    removeAuthToken();
    TemporayStorageService.setString(
      STORAGE_CONSTANTS.PREVIOUS_AUTH_URL,
      window.location.href
    );
    if (
      [
        NAVIGATION_LINKS.AUTH_SIGNIN,
        NAVIGATION_LINKS.SETUP.CREDENTIALS,
        NAVIGATION_LINKS.SETUP.USER,
      ].includes(window.location.pathname)
    ) {
      return;
    }
    window.location.replace(NAVIGATION_LINKS.AUTH_SIGNIN);
  },
  signIn: () => {
    window.location.replace(
      // TemporayStorageService.getString(STORAGE_CONSTANTS.PREVIOUS_AUTH_URL) ||
      NAVIGATION_LINKS.DASHBOARD.HOME
    );
  },
};
