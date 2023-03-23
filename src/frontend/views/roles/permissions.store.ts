import {
  dataNotFoundMessage,
  makeDeleteRequest,
  makePostRequest,
  MutationHelpers,
  MutationsLang,
  useApi,
  useApiMutateOptions,
} from "@hadmean/protozoa";
import { isRouterParamEnabled } from "frontend/hooks";
import { useMutation } from "react-query";
import { useRoleIdFromRouteParam } from "./hooks";

const SINGULAR = "Role Permission";

export const ADMIN_ROLE_PERMISSION_ENDPOINT = (roleId: string) =>
  `/api/roles/${roleId}/permissions`;

export function useRolePermissions() {
  const roleId = useRoleIdFromRouteParam();

  return useApi<string[]>(ADMIN_ROLE_PERMISSION_ENDPOINT(roleId), {
    enabled: isRouterParamEnabled(roleId),
    errorMessage: dataNotFoundMessage(SINGULAR),
  });
}

export function useRolePermissionDeletionMutation() {
  const roleId = useRoleIdFromRouteParam();

  const apiMutateOptions = useApiMutateOptions<string[], string[]>({
    dataQueryPath: ADMIN_ROLE_PERMISSION_ENDPOINT(roleId),
    onMutate: MutationHelpers.removeMany,
    successMessage: MutationsLang.delete(SINGULAR),
  });

  return useMutation(async (permissions: string[]) => {
    await makeDeleteRequest(ADMIN_ROLE_PERMISSION_ENDPOINT(roleId), {
      permissions,
    });
    return permissions;
  }, apiMutateOptions);
}

export function useCreateRolePermissionMutation() {
  const roleId = useRoleIdFromRouteParam();

  const apiMutateOptions = useApiMutateOptions<string[], string[]>({
    dataQueryPath: ADMIN_ROLE_PERMISSION_ENDPOINT(roleId),
    onMutate: MutationHelpers.mergeArray,
    successMessage: MutationsLang.create(SINGULAR),
  });

  return useMutation(async (permissions: string[]) => {
    await makePostRequest(ADMIN_ROLE_PERMISSION_ENDPOINT(roleId), {
      permissions,
    });
    return permissions;
  }, apiMutateOptions);
}
