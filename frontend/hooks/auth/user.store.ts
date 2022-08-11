import { dataNotFoundMessage, useStorageApi } from "@gothicgeeks/shared";
import { IAuthenticatedUserBag } from "shared/types";

export const AUTHENTICATED_ACCOUNT_URL = "/api/account/mine";

export function useAuthenticatedUserBag() {
  return useStorageApi<IAuthenticatedUserBag>(AUTHENTICATED_ACCOUNT_URL, {
    errorMessage: dataNotFoundMessage("Your account details"),
  });
}

export function usePageRequiresPermission(permission: string) {
  return permission;
}

export function useCanUser(permission: string) {
  return permission;
}
