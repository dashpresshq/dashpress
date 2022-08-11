import {
  dataNotFoundMessage,
  makeDeleteRequest,
  makePostRequest,
  MutationsLang,
  useApi,
  useWaitForResponseMutationOptions,
} from "@gothicgeeks/shared";
import { isRouterParamEnabled } from "frontend/hooks";
import { NAVIGATION_LINKS } from "frontend/lib/routing";
import { useRouter } from "next-router-mock";
import { useMutation } from "react-query";
import { ICreateRoleForm } from "shared/form-schemas/roles/create";
import {
  ADMIN_ROLES_ENDPOINT,
  ADMIN_ROLES_DETAILS_ENDPOINT,
} from "./roles.store";

export const ADMIN_ROLE_PERMISSION_ENDPOINT = (roleId: string) =>
  `/api/roles/${roleId}/permissions`;

export function useRolePermissions(roleId: string) {
  return useApi<string[]>(ADMIN_ROLE_PERMISSION_ENDPOINT(roleId), {
    enabled: isRouterParamEnabled(roleId),
    errorMessage: dataNotFoundMessage("Role permission"),
  });
}

export function useRolePermissionDeletionMutation() {
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [ADMIN_ROLES_ENDPOINT],
    redirect: NAVIGATION_LINKS.ROLES.LIST,
    successMessage: MutationsLang.delete("Role"),
  });

  return useMutation(
    async (roleId: string) =>
      await makeDeleteRequest(ADMIN_ROLES_DETAILS_ENDPOINT(roleId)),
    apiMutateOptions
  );
}

export function useCreateRolePermissionMutation() {
  const router = useRouter();
  const apiMutateOptions = useWaitForResponseMutationOptions<ICreateRoleForm>({
    endpoints: [ADMIN_ROLES_ENDPOINT],
    smartSuccessMessage: ({ name }) => ({
      message: MutationsLang.create("Role"),
      action: {
        label: `Click here to view role`,
        action: () => router.push(NAVIGATION_LINKS.ROLES.DETAILS(name)),
      },
    }),
    successMessage: MutationsLang.create("Role"),
  });

  return useMutation(async (data: ICreateRoleForm) => {
    await makePostRequest(ADMIN_ROLES_ENDPOINT, data);
    return data;
  }, apiMutateOptions);
}
