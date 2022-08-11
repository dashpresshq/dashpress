import {
  makeDeleteRequest,
  makePatchRequest,
  makePostRequest,
  MutationsLang,
  useWaitForResponseMutationOptions,
} from "@gothicgeeks/shared";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { ICreateRoleForm } from "shared/form-schemas/roles/create";
import { IUpdateRoleForm } from "shared/form-schemas/roles/update";
import { useRoleIdFromRouteParam } from "./hooks";

export const ADMIN_ROLES_ENDPOINT = "/api/roles";

export const ADMIN_ROLES_DETAILS_ENDPOINT = (roleId: string) =>
  `/api/roles/${roleId}`;

export function useRoleDeletionMutation() {
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

export function useUpdateRoleMutation() {
  const roleId = useRoleIdFromRouteParam();
  const apiMutateOptions = useWaitForResponseMutationOptions<void>({
    endpoints: [ADMIN_ROLES_ENDPOINT, ADMIN_ROLES_DETAILS_ENDPOINT(roleId)],
    successMessage: MutationsLang.edit("User"),
  });

  return useMutation(
    async (data: Partial<IUpdateRoleForm>) =>
      await makePatchRequest(ADMIN_ROLES_DETAILS_ENDPOINT(roleId), data),
    apiMutateOptions
  );
}

export function useCreateRoleMutation() {
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
  });

  return useMutation(async (data: ICreateRoleForm) => {
    await makePostRequest(ADMIN_ROLES_ENDPOINT, data);
    return data;
  }, apiMutateOptions);
}
