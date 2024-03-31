import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useRouter } from "next/router";
import { IBaseRoleForm } from "shared/form-schemas/roles/base";
import { makeRoleId } from "shared/constants/user";
import { IRolesList } from "shared/types/roles";
import { MAKE_CRUD_CONFIG } from "frontend/lib/crud-config";
import { useWaitForResponseMutationOptions } from "frontend/lib/data/useMutate/useWaitForResponseMutationOptions";
import { makeActionRequest } from "frontend/lib/data/makeRequest";
import { MutationHelpers } from "frontend/lib/data/useMutate/mutation-helpers";
import { useApiMutateOptimisticOptions } from "frontend/lib/data/useMutate/useApiMutateOptimisticOptions";

export const ADMIN_ROLES_CRUD_CONFIG = MAKE_CRUD_CONFIG({
  path: "/api/roles",
  plural: "Roles",
  singular: "Role",
});

export function useCreateRoleMutation() {
  const router = useRouter();
  return useWaitForResponseMutationOptions<IBaseRoleForm, IBaseRoleForm>({
    mutationFn: async (data) => {
      await makeActionRequest(
        "POST",
        ADMIN_ROLES_CRUD_CONFIG.ENDPOINTS.CREATE,
        data
      );
      return data;
    },
    endpoints: [ADMIN_ROLES_CRUD_CONFIG.ENDPOINTS.LIST],
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
      await makeActionRequest(
        "DELETE",
        ADMIN_ROLES_CRUD_CONFIG.ENDPOINTS.DELETE(roleId)
      ),
    dataQueryPath: ADMIN_ROLES_CRUD_CONFIG.ENDPOINTS.LIST,
    onSuccessActionWithFormData: () => {
      router.replace(NAVIGATION_LINKS.ROLES.LIST);
    },
    onMutate: MutationHelpers.deleteByKey("value"),
    successMessage: ADMIN_ROLES_CRUD_CONFIG.MUTATION_LANG.DELETE,
  });
}
