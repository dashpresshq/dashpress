import { useEffect } from "react";
import { createStore } from "frontend/lib/store";
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
  const setIsAuthenticated = useIsAuthenticatedStore(
    (store) => store.setIsAuthenticated
  );

  return (authToken: string, rememberMe: boolean) => {
    AuthStore.setAuthToken(authToken, rememberMe);

    setIsAuthenticated(true);
  };
}
