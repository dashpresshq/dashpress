import { dataNotFoundMessage, useStorageApi } from "@gothicgeeks/shared";

export function useMyPermissions() {
  return useStorageApi<string[]>("/api/account/permissions", {
    errorMessage: dataNotFoundMessage("Role permission"),
  });
}
