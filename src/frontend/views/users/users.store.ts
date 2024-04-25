import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useRouter } from "next/router";
import { ICreateUserForm } from "shared/form-schemas/users";
import { IResetPasswordForm } from "shared/form-schemas/users/reset-password";
import { IAccountProfile } from "shared/types/user";
import {
  MAKE_CRUD_CONFIG,
  MAKE_ENDPOINTS_CONFIG,
} from "frontend/lib/crud-config";
import { useApi } from "frontend/lib/data/useApi";
import { useApiMutateOptimisticOptions } from "frontend/lib/data/useMutate/useApiMutateOptimisticOptions";
import { ApiRequest } from "frontend/lib/data/makeRequest";
import { MutationHelpers } from "frontend/lib/data/useMutate/mutation-helpers";
import { useWaitForResponseMutationOptions } from "frontend/lib/data/useMutate/useWaitForResponseMutationOptions";
import { msg } from "@lingui/macro";
import { useUsernameFromRouteParam } from "./hooks";

export const ADMIN_USERS_CRUD_CONFIG = MAKE_CRUD_CONFIG({
  plural: msg`Users`,
  singular: msg`User`,
});

export const USERS_ENDPOINT_CONFIG = MAKE_ENDPOINTS_CONFIG("/api/account");

export function useAllUsers() {
  return useApi<IAccountProfile[]>(USERS_ENDPOINT_CONFIG.LIST, {
    defaultData: [],
  });
}

export function useUserDetails(username: string) {
  return useApi<IAccountProfile>(USERS_ENDPOINT_CONFIG.DETAILS(username), {
    defaultData: {
      name: "",
      role: "",
      username: "",
    },
    errorMessage: ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.NOT_FOUND,
  });
}

export function useUserDeletionMutation() {
  const router = useRouter();
  return useApiMutateOptimisticOptions<IAccountProfile[], string>({
    mutationFn: async (username) =>
      await ApiRequest.DELETE(USERS_ENDPOINT_CONFIG.DELETE(username)),
    dataQueryPath: USERS_ENDPOINT_CONFIG.LIST,
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
      await ApiRequest.PATCH(USERS_ENDPOINT_CONFIG.UPDATE(username), data),
    endpoints: [
      USERS_ENDPOINT_CONFIG.LIST,
      USERS_ENDPOINT_CONFIG.DETAILS(username),
    ],
    successMessage: ADMIN_USERS_CRUD_CONFIG.MUTATION_LANG.EDIT,
  });
}

export function useResetUserPasswordMutation() {
  const username = useUsernameFromRouteParam();
  return useWaitForResponseMutationOptions<IResetPasswordForm>({
    mutationFn: async (data) =>
      await ApiRequest.PATCH(
        USERS_ENDPOINT_CONFIG.CUSTOM(username, "reset-password"),
        data
      ),
    endpoints: [],
    successMessage: msg`Password Reset Successfully`,
  });
}

export function useCreateUserMutation() {
  const router = useRouter();
  return useWaitForResponseMutationOptions<ICreateUserForm, ICreateUserForm>({
    mutationFn: async (data: ICreateUserForm) => {
      await ApiRequest.POST(USERS_ENDPOINT_CONFIG.CREATE, data);
      return data;
    },
    endpoints: [USERS_ENDPOINT_CONFIG.LIST],
    smartSuccessMessage: ({ username }) => ({
      message: ADMIN_USERS_CRUD_CONFIG.MUTATION_LANG.CREATE,
      action: {
        label: ADMIN_USERS_CRUD_CONFIG.MUTATION_LANG.VIEW_DETAILS,
        action: () => router.push(NAVIGATION_LINKS.USERS.DETAILS(username)),
      },
    }),
  });
}
