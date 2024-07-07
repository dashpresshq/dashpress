import { useMemo } from "react";
import languages from "translations/languages";

import { NAVIGATION_LINKS } from "@/frontend/lib/routing/links";
import { StorageService, TemporayStorageService } from "@/frontend/lib/storage";
import { STORAGE_CONSTANTS } from "@/frontend/lib/storage/constants";

import { PORTAL_GUEST_ROUTES } from "./portal";

const JWT_TOKEN_STORAGE_KEY = "__auth-token__";

const getAuthToken = (): string | null =>
  TemporayStorageService.getString(JWT_TOKEN_STORAGE_KEY) ||
  StorageService.getString(JWT_TOKEN_STORAGE_KEY);

const isAuthenticated = () => !!getAuthToken();

const removeAuthToken = (): void => {
  StorageService.removeString(JWT_TOKEN_STORAGE_KEY);
  TemporayStorageService.removeString(JWT_TOKEN_STORAGE_KEY);
};

const replaceWithLocale = (path: string) => {
  const pathSplit = window.location.pathname.split("/");
  const maybeLocale = pathSplit[1];
  let pathWithLocale = path;
  if (languages.map((language) => language.locale).includes(maybeLocale)) {
    pathWithLocale = `/${maybeLocale}/${path}`;
  }
  window.location.replace(pathWithLocale);
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
  signOut: () => {
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
        ...PORTAL_GUEST_ROUTES,
      ].includes(window.location.pathname)
    ) {
      return;
    }
    replaceWithLocale(NAVIGATION_LINKS.AUTH_SIGNIN);
  },
  signIn: () => {
    replaceWithLocale(
      // TemporayStorageService.getString(STORAGE_CONSTANTS.PREVIOUS_AUTH_URL) ||
      NAVIGATION_LINKS.DASHBOARD.HOME
    );
  },
};

export const useIsUserAutenticated = () => {
  const isClient = typeof window !== "undefined";
  return useMemo(() => {
    if (isClient) {
      return AuthActions.isAuthenticated();
    }
    return false;
  }, [isClient]);
};
