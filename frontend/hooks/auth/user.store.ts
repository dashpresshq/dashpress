import {
  dataNotFoundMessage,
  ToastService,
  useStorageApi,
} from "@gothicgeeks/shared";
import { NAVIGATION_LINKS } from "frontend/lib/routing";
import { useRouter } from "next/router";
import {
  canRoleDoThis,
  IAuthenticatedUserBag,
  META_USER_PERMISSIONS,
} from "shared/types";

export const AUTHENTICATED_ACCOUNT_URL = "/api/account/mine";

export function useAuthenticatedUserBag() {
  return useStorageApi<IAuthenticatedUserBag>(AUTHENTICATED_ACCOUNT_URL, {
    errorMessage: dataNotFoundMessage("Your account details"),
  });
}

export function useCanUser(permission: string): boolean | "loading" {
  const userProfile = useAuthenticatedUserBag();
  if (permission === META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED) {
    return true;
  }
  if (userProfile.isLoading) {
    return "loading";
  }
  const { role, permissions } = userProfile.data;

  return canRoleDoThis(
    role,
    permission,
    () => permissions
  ) as unknown as boolean;
}

export function usePageRequiresPermission(
  permission: string
): "loading" | void {
  const router = useRouter();
  const canUser = useCanUser(permission);
  if (canUser === "loading") {
    return "loading";
  }
  if (!canUser) {
    ToastService.error("You dont have the permission to view this page");
    router.replace(NAVIGATION_LINKS.DASHBOARD);
  }
}
