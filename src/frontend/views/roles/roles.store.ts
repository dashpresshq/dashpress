import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useRouter } from "next/router";
import { IBaseRoleForm } from "shared/form-schemas/roles/base";
import { makeRoleId } from "shared/constants/user";
import { IRolesList } from "shared/types/roles";
import {
  MAKE_CRUD_CONFIG,
  MAKE_ENDPOINTS_CONFIG,
} from "frontend/lib/crud-config";
import { useWaitForResponseMutationOptions } from "frontend/lib/data/useMutate/useWaitForResponseMutationOptions";
import { makeActionRequest } from "frontend/lib/data/makeRequest";
import { MutationHelpers } from "frontend/lib/data/useMutate/mutation-helpers";
import { useApiMutateOptimisticOptions } from "frontend/lib/data/useMutate/useApiMutateOptimisticOptions";
import { msg } from "@lingui/macro";

export const ADMIN_ROLES_CRUD_CONFIG = MAKE_CRUD_CONFIG({
  plural: msg`Roles`,
  singular: msg`Role`,
});

export const ROLES_ENDPOINT_CONFIG = MAKE_ENDPOINTS_CONFIG("/api/roles");

export function useCreateRoleMutation() {
  const router = useRouter();
  return useWaitForResponseMutationOptions<IBaseRoleForm, IBaseRoleForm>({
    mutationFn: async (data) => {
      await makeActionRequest("POST", ROLES_ENDPOINT_CONFIG.CREATE, data);
      return data;
    },
    endpoints: [ROLES_ENDPOINT_CONFIG.LIST],
    smartSuccessMessage: ({ name }) => ({
      message: ADMIN_ROLES_CRUD_CONFIG.MUTATION_LANG.CREATE,
      action: {
        label: ADMIN_ROLES_CRUD_CONFIG.MUTATION_LANG.VIEW_DETAILS,
        action: () =>
          router.push(NAVIGATION_LINKS.ROLES.DETAILS(makeRoleId(name))),
      },
    }),
  });
}

export function useRoleDeletionMutation() {
  const router = useRouter();
  return useApiMutateOptimisticOptions<IRolesList[], string>({
    mutationFn: async (roleId) =>
      await makeActionRequest("DELETE", ROLES_ENDPOINT_CONFIG.DELETE(roleId)),
    dataQueryPath: ROLES_ENDPOINT_CONFIG.LIST,
    onSuccessActionWithFormData: () => {
      router.replace(NAVIGATION_LINKS.ROLES.LIST);
    },
    onMutate: MutationHelpers.deleteByKey("value"),
    successMessage: ADMIN_ROLES_CRUD_CONFIG.MUTATION_LANG.DELETE,
  });
}
