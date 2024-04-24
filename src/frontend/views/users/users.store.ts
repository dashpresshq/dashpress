import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useRouter } from "next/router";
import { ICreateUserForm } from "shared/form-schemas/users";
import { IResetPasswordForm } from "shared/form-schemas/users/reset-password";
import { IAccountProfile } from "shared/types/user";
import { MAKE_CRUD_CONFIG } from "frontend/lib/crud-config";
import { useApi } from "frontend/lib/data/useApi";
import { useApiMutateOptimisticOptions } from "frontend/lib/data/useMutate/useApiMutateOptimisticOptions";
import { makeActionRequest } from "frontend/lib/data/makeRequest";
import { MutationHelpers } from "frontend/lib/data/useMutate/mutation-helpers";
import { useWaitForResponseMutationOptions } from "frontend/lib/data/useMutate/useWaitForResponseMutationOptions";
import { t } from "@lingui/macro";
import { useUsernameFromRouteParam } from "./hooks";

export const ADMIN_USERS_CRUD_CONFIG = MAKE_CRUD_CONFIG({
  path: "/api/account",
  plural: "Users",
  singular: t`User`,
});

export function useAllUsers() {
  return useApi<IAccountProfile[]>(ADMIN_USERS_CRUD_CONFIG.ENDPOINTS.LIST, {
    defaultData: [],
  });
}

export function useUserDetails(username: string) {
  return useApi<IAccountProfile>(
    ADMIN_USERS_CRUD_CONFIG.ENDPOINTS.DETAILS(username),
    {
      defaultData: {
        name: "",
        role: "",
        username: "",
      },
      errorMessage: ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.NOT_FOUND,
    }
  );
}

export function useUserDeletionMutation() {
  const router = useRouter();
  return useApiMutateOptimisticOptions<IAccountProfile[], string>({
    mutationFn: async (username) =>
      await makeActionRequest(
        "DELETE",
        ADMIN_USERS_CRUD_CONFIG.ENDPOINTS.DELETE(username)
      ),
    dataQueryPath: ADMIN_USERS_CRUD_CONFIG.ENDPOINTS.LIST,
    onSuccessActionWithFormData: () => {
      router.replace(NAVIGATION_LINKS.USERS.LIST);
    },
    onMutate: MutationHelpers.deleteByKey("username"),
    successMessage: ADMIN_USERS_CRUD_CONFIG.MUTATION_LANG.DELETE,
  });
}

export function useUpdateUserMutation() {
  const username = useUsernameFromRouteParam();
  return useWaitForResponseMutationOptions<Partial<IAccountProfile>>({
    mutationFn: async (data) =>
      await makeActionRequest(
        "PATCH",
        ADMIN_USERS_CRUD_CONFIG.ENDPOINTS.UPDATE(username),
        data
      ),
    endpoints: [
      ADMIN_USERS_CRUD_CONFIG.ENDPOINTS.LIST,
      ADMIN_USERS_CRUD_CONFIG.ENDPOINTS.DETAILS(username),
    ],
    successMessage: ADMIN_USERS_CRUD_CONFIG.MUTATION_LANG.EDIT,
  });
}

export function useResetUserPasswordMutation() {
  const username = useUsernameFromRouteParam();
  return useWaitForResponseMutationOptions<IResetPasswordForm>({
    mutationFn: async (data) =>
      await makeActionRequest(
        "PATCH",
        ADMIN_USERS_CRUD_CONFIG.ENDPOINTS.CUSTOM(username, "reset-password"),
        data
      ),
    endpoints: [],
    successMessage: "Password Reset Successfully",
  });
}

export function useCreateUserMutation() {
  const router = useRouter();
  return useWaitForResponseMutationOptions<ICreateUserForm, ICreateUserForm>({
    mutationFn: async (data: ICreateUserForm) => {
      await makeActionRequest(
        "POST",
        ADMIN_USERS_CRUD_CONFIG.ENDPOINTS.CREATE,
        data
      );
      return data;
    },
    endpoints: [ADMIN_USERS_CRUD_CONFIG.ENDPOINTS.LIST],
    smartSuccessMessage: ({ username }) => ({
      message: ADMIN_USERS_CRUD_CONFIG.MUTATION_LANG.CREATE,
      action: {
        label: ADMIN_USERS_CRUD_CONFIG.MUTATION_LANG.VIEW_DETAILS,
        action: () => router.push(NAVIGATION_LINKS.USERS.DETAILS(username)),
      },
    }),
  });
}
