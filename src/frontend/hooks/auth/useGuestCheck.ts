import { useRouter } from "next/router";
import { useEffect } from "react";
import { NAVIGATION_LINKS } from "frontend/lib/routing";
import { useUserAuthenticatedState } from "./useAuthenticateUser";

export const useGuestCheck = () => {
  const userAuthenticatedState = useUserAuthenticatedState();
  const router = useRouter();
  useEffect(() => {
    if (userAuthenticatedState === true) {
      router.replace(NAVIGATION_LINKS.DASHBOARD);
    }
  }, [typeof window, userAuthenticatedState]);

  return userAuthenticatedState === "loading";
};
