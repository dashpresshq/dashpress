import {
  makeDeleteRequest,
  makePostRequest,
  MutationHelpers,
  useApi,
  useApiMutateOptitmisticOptions,
} from "@hadmean/protozoa";
import { isRouterParamEnabled } from "frontend/hooks";
import { useMutation } from "react-query";
import { MAKE_CRUD_CONFIG } from "frontend/lib/makeCrudConfig";
import { useRoleIdFromRouteParam } from "./hooks";
import { ADMIN_ROLES_CRUD_CONFIG } from "./roles.store";

export const ADMIN_PERMISSIONS_CRUD_CONFIG = MAKE_CRUD_CONFIG({
  path: "N/A",
  plural: "Role Permissions",
  singular: "Role Permission",
});

export const ADMIN_ROLE_PERMISSION_ENDPOINT = (roleId: string) =>
  ADMIN_ROLES_CRUD_CONFIG.ENDPOINTS.CUSTOM(roleId, "permissions");

export function useRolePermissions() {
  const roleId = useRoleIdFromRouteParam();

  return useApi<string[]>(ADMIN_ROLE_PERMISSION_ENDPOINT(roleId), {
    enabled: isRouterParamEnabled(roleId),
    errorMessage: ADMIN_PERMISSIONS_CRUD_CONFIG.TEXT_LANG.NOT_FOUND,
  });
}

export function useRolePermissionDeletionMutation() {
  const roleId = useRoleIdFromRouteParam();

  const apiMutateOptions = useApiMutateOptitmisticOptions<string[], string[]>({
    dataQueryPath: ADMIN_ROLE_PERMISSION_ENDPOINT(roleId),
    onMutate: MutationHelpers.removeMany,
    successMessage: ADMIN_PERMISSIONS_CRUD_CONFIG.MUTATION_LANG.DELETE,
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

  const apiMutateOptions = useApiMutateOptitmisticOptions<string[], string[]>({
    dataQueryPath: ADMIN_ROLE_PERMISSION_ENDPOINT(roleId),
    onMutate: MutationHelpers.mergeArray,
    successMessage: ADMIN_PERMISSIONS_CRUD_CONFIG.MUTATION_LANG.CREATE,
  });

  return useMutation(
    async (permissions: string[]) =>
      await makePostRequest(ADMIN_ROLE_PERMISSION_ENDPOINT(roleId), {
        permissions,
      }),
    apiMutateOptions
  );
}
