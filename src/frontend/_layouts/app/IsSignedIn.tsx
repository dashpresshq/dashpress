import { ComponentIsLoading } from "@hadmean/chromista";
import React, { ReactNode, useEffect } from "react";
import { AuthService, getQueryCachekey } from "@hadmean/protozoa";
import { useRouter } from "next/router";
import { AUTHENTICATED_ACCOUNT_URL } from "frontend/hooks/auth/user.store";
import { useUserAuthenticatedState } from "frontend/hooks/auth/useAuthenticateUser";
import { useQueryClient } from "react-query";
import { NAVIGATION_LINKS } from "../../lib/routing/links";
import { useAppTheme } from "../useAppTheme";

const useUserAuthCheck = () => {
  const userAuthenticatedState = useUserAuthenticatedState();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (userAuthenticatedState === false) {
      AuthService.removeAuthToken();
      router.replace(NAVIGATION_LINKS.AUTH_SIGNIN);
      queryClient.invalidateQueries(
        getQueryCachekey(AUTHENTICATED_ACCOUNT_URL)
      );
    }
  }, [userAuthenticatedState]);

  return userAuthenticatedState;
};

export function IsSignedIn({ children }: { children: ReactNode }) {
  useAppTheme();
  const userAuthenticatedState = useUserAuthCheck();

  if (userAuthenticatedState !== true) {
    return <ComponentIsLoading />;
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
