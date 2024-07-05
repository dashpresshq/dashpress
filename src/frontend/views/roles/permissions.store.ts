import { useDomainMessages } from "frontend/lib/crud-config";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";
import { ApiRequest } from "frontend/lib/data/makeRequest";
import { useApi } from "frontend/lib/data/useApi";
import { MutationHelpers } from "frontend/lib/data/useMutate/mutation-helpers";
import { useApiMutateOptimisticOptions } from "frontend/lib/data/useMutate/useApiMutateOptimisticOptions";
import { objectToQueryParams } from "frontend/lib/routing/queryObjectToQueryString";

import { useRoleIdFromRouteParam } from "./hooks";
import { ROLES_ENDPOINT_CONFIG } from "./roles.store";

export const ADMIN_ROLE_PERMISSION_ENDPOINT = (roleId: string) =>
  ROLES_ENDPOINT_CONFIG.CUSTOM(roleId, "permissions");

export function useRolePermissions() {
  const domainMessages = useDomainMessages(LANG_DOMAINS.ACCOUNT.PERMISSIONS);
  const roleId = useRoleIdFromRouteParam();

  return useApi<string[]>(ADMIN_ROLE_PERMISSION_ENDPOINT(roleId), {
    errorMessage: domainMessages.TEXT_LANG.NOT_FOUND,
    defaultData: [],
  });
}

export function useDeleteRolePermissionMutation() {
  const roleId = useRoleIdFromRouteParam();
  const domainMessages = useDomainMessages(LANG_DOMAINS.ACCOUNT.PERMISSIONS);

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
    successMessage: { description: domainMessages.MUTATION_LANG.DELETE },
  });
}

export function useCreateRolePermissionMutation() {
  const roleId = useRoleIdFromRouteParam();
  const domainMessages = useDomainMessages(LANG_DOMAINS.ACCOUNT.PERMISSIONS);

  return useApiMutateOptimisticOptions<string[], string[]>({
    mutationFn: async (permissions) =>
      await ApiRequest.POST(ADMIN_ROLE_PERMISSION_ENDPOINT(roleId), {
        permissions,
      }),
    dataQueryPath: ADMIN_ROLE_PERMISSION_ENDPOINT(roleId),
    onMutate: MutationHelpers.mergeArray,
    successMessage: { description: domainMessages.MUTATION_LANG.CREATE },
  });
}
