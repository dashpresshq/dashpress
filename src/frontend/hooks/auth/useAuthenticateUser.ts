import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { createStore } from "frontend/lib/store";
import { SLUG_LOADING_VALUE } from "frontend/lib/routing/constants";
import * as AuthStore from "./auth.store";

type IStore = {
  isAuthenticated: "loading" | boolean;
  setIsAuthenticated: (state: boolean) => void;
};

export const useIsAuthenticatedStore = createStore<IStore>((set) => ({
  isAuthenticated: "loading",
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
  const nextRoute = useRouteParam("next");
  const router = useRouter();
  const setIsAuthenticated = useIsAuthenticatedStore(
    (store) => store.setIsAuthenticated
  );

  return (authToken: string, rememberMe: boolean) => {
    AuthStore.setAuthToken(authToken, rememberMe);
    setIsAuthenticated(true);
    router.push(
      nextRoute === SLUG_LOADING_VALUE || !nextRoute
        ? NAVIGATION_LINKS.DASHBOARD.HOME
        : nextRoute
    );
  };
}
