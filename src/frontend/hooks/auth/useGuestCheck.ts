import { useRouter } from "next/router";
import { useEffect } from "react";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { TemporayStorageService } from "frontend/lib/storage";
import { STORAGE_CONSTANTS } from "frontend/lib/storage/constants";
import { useUserAuthenticatedState } from "./useAuthenticateUser";

export const useGuestCheck = () => {
  const userAuthenticatedState = useUserAuthenticatedState();
  const router = useRouter();
  useEffect(() => {
    if (userAuthenticatedState === true) {
      router.replace(
        TemporayStorageService.getString(STORAGE_CONSTANTS.PREVIOUS_AUTH_URL) ||
          NAVIGATION_LINKS.DASHBOARD.HOME
      );
    }
  }, [typeof window, userAuthenticatedState]);

  return userAuthenticatedState === "loading";
};
