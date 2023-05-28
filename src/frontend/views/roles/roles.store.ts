import {
  MutationHelpers,
  makeDeleteRequest,
  makePostRequest,
  useApiMutateOptimisticOptions,
  useWaitForResponseMutationOptions,
} from "@hadmean/protozoa";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { IBaseRoleForm } from "shared/form-schemas/roles/base";
import { makeRoleId } from "shared/constants/user";
import { IRolesList } from "shared/types/roles";
import { MAKE_CRUD_CONFIG } from "frontend/lib/makeCrudConfig";

export const ADMIN_ROLES_CRUD_CONFIG = MAKE_CRUD_CONFIG({
  path: "/api/roles",
  plural: "Roles",
  singular: "Role",
});

export function useCreateRoleMutation() {
  const router = useRouter();
  const apiMutateOptions = useWaitForResponseMutationOptions<IBaseRoleForm>({
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

  return useMutation(async (data: IBaseRoleForm) => {
    await makePostRequest(ADMIN_ROLES_CRUD_CONFIG.ENDPOINTS.CREATE, data);
    return data;
  }, apiMutateOptions);
}

export function useRoleDeletionMutation() {
  const router = useRouter();
  const apiMutateOptions = useApiMutateOptimisticOptions<IRolesList[], string>({
    dataQueryPath: ADMIN_ROLES_CRUD_CONFIG.ENDPOINTS.LIST,
    onSuccessActionWithFormData: () => {
      router.replace(NAVIGATION_LINKS.ROLES.LIST);
    },
    onMutate: MutationHelpers.deleteByKey("value"),
    successMessage: ADMIN_ROLES_CRUD_CONFIG.MUTATION_LANG.DELETE,
  });

  return useMutation(
    async (roleId: string) =>
      await makeDeleteRequest(ADMIN_ROLES_CRUD_CONFIG.ENDPOINTS.DELETE(roleId)),
    apiMutateOptions
  );
}
