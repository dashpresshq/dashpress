import React, { ReactNode, useEffect } from "react";
import { AUTHENTICATED_ACCOUNT_URL } from "frontend/hooks/auth/user.store";
import { useUserAuthenticatedState } from "frontend/hooks/auth/useAuthenticateUser";
import { useQueryClient } from "react-query";
import { removeAuthToken } from "frontend/hooks/auth/auth.store";
import { getQueryCachekey } from "frontend/lib/data/constants/getQueryCacheKey";
import { ComponentIsLoading } from "frontend/design-system/components/ComponentIsLoading";
import { useAppTheme } from "../useAppTheme";

const useUserAuthCheck = () => {
  const userAuthenticatedState = useUserAuthenticatedState();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (userAuthenticatedState === false) {
      removeAuthToken();
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
