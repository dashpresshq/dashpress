import {
  AuthService,
  createStore,
  SLUG_LOADING_VALUE,
} from "@hadmean/protozoa";
import { NAVIGATION_LINKS, useRouteParam } from "frontend/lib/routing";
import { useRouter } from "next/router";
import { useEffect } from "react";

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
      setIsAuthenticated(AuthService.isAuthenticated());
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
    AuthService.setAuthToken(authToken, rememberMe);
    setIsAuthenticated(true);
    router.push(
      nextRoute === SLUG_LOADING_VALUE || !nextRoute
        ? NAVIGATION_LINKS.DASHBOARD
        : nextRoute
    );
  };
}
