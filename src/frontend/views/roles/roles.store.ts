import {
  makeDeleteRequest,
  makePostRequest,
  MutationsLang,
  useWaitForResponseMutationOptions,
} from "@hadmean/protozoa";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { IBaseRoleForm } from "shared/form-schemas/roles/base";
import { makeRoleId } from "shared/types/user";

export const ADMIN_ROLES_ENDPOINT = "/api/roles";

export const ADMIN_ROLES_DETAILS_ENDPOINT = (roleId: string) =>
  `/api/roles/${roleId}`;

export function useRoleDeletionMutation() {
  const router = useRouter();
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [ADMIN_ROLES_ENDPOINT],
    onSuccessActionWithFormData: () => {
      router.replace(NAVIGATION_LINKS.ROLES.LIST);
    },

    successMessage: MutationsLang.delete("Role"),
  });

  return useMutation(
    async (roleId: string) =>
      await makeDeleteRequest(ADMIN_ROLES_DETAILS_ENDPOINT(roleId)),
    apiMutateOptions
  );
}

export function useCreateRoleMutation() {
  const router = useRouter();
  const apiMutateOptions = useWaitForResponseMutationOptions<IBaseRoleForm>({
    endpoints: [ADMIN_ROLES_ENDPOINT],
    smartSuccessMessage: ({ name }) => ({
      message: MutationsLang.create("Role"),
      action: {
        label: MutationsLang.viewDetails("role"),
        action: () =>
          router.push(NAVIGATION_LINKS.ROLES.DETAILS(makeRoleId(name))),
      },
    }),
  });

  return useMutation(async (data: IBaseRoleForm) => {
    await makePostRequest(ADMIN_ROLES_ENDPOINT, data);
    return data;
  }, apiMutateOptions);
}
