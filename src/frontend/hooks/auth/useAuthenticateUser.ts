import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { TemporayStorageService } from "frontend/lib/storage";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { createStore } from "frontend/lib/store";
import { STORAGE_CONSTANTS } from "frontend/lib/storage/constants";
import { DataStates } from "frontend/lib/data/types";
import * as AuthStore from "./auth.store";

type IStore = {
  isAuthenticated: DataStates.Loading | boolean;
  setIsAuthenticated: (state: boolean) => void;
};

export const useIsAuthenticatedStore = createStore<IStore>((set) => ({
  isAuthenticated: DataStates.Loading,
  setIsAuthenticated: (state: boolean) =>
    set(() => ({
      isAuthenticated: state,
    })),
}));

export const useUserAuthenticatedState = () => {
  const [isAuthenticated, setIsAuthenticated] = useIsAuthenticatedStore(
    (store) => [store.isAuthenticated, store.setIsAuthenticated]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAuthenticated(AuthStore.isAuthenticated());
    }
  }, [typeof window]);

  return isAuthenticated;
};

export function useAuthenticateUser() {
  const router = useRouter();
  const setIsAuthenticated = useIsAuthenticatedStore(
    (store) => store.setIsAuthenticated
  );

  return (authToken: string, rememberMe: boolean) => {
    AuthStore.setAuthToken(authToken, rememberMe);

    setIsAuthenticated(true);
    router.push(
      TemporayStorageService.getString(STORAGE_CONSTANTS.PREVIOUS_AUTH_URL) ||
        NAVIGATION_LINKS.DASHBOARD.HOME
    );
  };
}
