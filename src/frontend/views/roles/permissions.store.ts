import { MAKE_CRUD_CONFIG } from "frontend/lib/crud-config";
import { useStorageApi } from "frontend/lib/data/useApi";
import { useApiMutateOptimisticOptions } from "frontend/lib/data/useMutate/useApiMutateOptimisticOptions";
import { MutationHelpers } from "frontend/lib/data/useMutate/mutation-helpers";
import { ApiRequest } from "frontend/lib/data/makeRequest";
import { msg } from "@lingui/macro";
import { objectToQueryParams } from "frontend/lib/routing/queryObjectToQueryString";
import { useRoleIdFromRouteParam } from "./hooks";
import { ROLES_ENDPOINT_CONFIG } from "./roles.store";

export const ADMIN_PERMISSIONS_CRUD_CONFIG = MAKE_CRUD_CONFIG({
  plural: msg`Role Permissions`,
  singular: msg`Role Permission`,
});

export const ADMIN_ROLE_PERMISSION_ENDPOINT = (roleId: string) =>
  ROLES_ENDPOINT_CONFIG.CUSTOM(roleId, "permissions");

export function useRolePermissions() {
  const roleId = useRoleIdFromRouteParam();

  return useStorageApi<string[]>(ADMIN_ROLE_PERMISSION_ENDPOINT(roleId), {
    errorMessage: ADMIN_PERMISSIONS_CRUD_CONFIG.TEXT_LANG.NOT_FOUND,
    defaultData: [],
  });
}

export function useDeleteRolePermissionMutation() {
  const roleId = useRoleIdFromRouteParam();

  return useApiMutateOptimisticOptions<string[], string[]>({
    mutationFn: async (permissions) => {
      await ApiRequest.DELETE(
        `${ADMIN_ROLE_PERMISSION_ENDPOINT(roleId)}${objectToQueryParams({
          permissions,
        })}`
      );
    },
    dataQueryPath: ADMIN_ROLE_PERMISSION_ENDPOINT(roleId),
    onMutate: MutationHelpers.removeMany,
    successMessage: ADMIN_PERMISSIONS_CRUD_CONFIG.MUTATION_LANG.DELETE,
  });
}

export function useCreateRolePermissionMutation() {
  const roleId = useRoleIdFromRouteParam();

  return useApiMutateOptimisticOptions<string[], string[]>({
    mutationFn: async (permissions) =>
      await ApiRequest.POST(ADMIN_ROLE_PERMISSION_ENDPOINT(roleId), {
        permissions,
      }),
    dataQueryPath: ADMIN_ROLE_PERMISSION_ENDPOINT(roleId),
    onMutate: MutationHelpers.mergeArray,
    successMessage: ADMIN_PERMISSIONS_CRUD_CONFIG.MUTATION_LANG.CREATE,
  });
}
