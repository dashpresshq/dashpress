import { isRouterParamEnabled } from "frontend/hooks";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { ICreateUserForm } from "shared/form-schemas/users/create";
import { IResetPasswordForm } from "shared/form-schemas/users/reset-password";
import { IAccountProfile } from "shared/types/user";
import { MAKE_CRUD_CONFIG } from "frontend/lib/crud-config";
import { useApi } from "frontend/lib/data/useApi";
import { useApiMutateOptimisticOptions } from "frontend/lib/data/useMutate/useApiMutateOptimisticOptions";
import { makeActionRequest } from "frontend/lib/data/makeRequest";
import { MutationHelpers } from "frontend/lib/data/useMutate/mutation-helpers";
import { useWaitForResponseMutationOptions } from "frontend/lib/data/useMutate/useWaitForResponseMutationOptions";
import { useUsernameFromRouteParam } from "./hooks";

export const ADMIN_USERS_CRUD_CONFIG = MAKE_CRUD_CONFIG({
  path: "/api/account",
  plural: "Users",
  singular: "User",
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
      enabled: isRouterParamEnabled(username),
      errorMessage: ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.NOT_FOUND,
    }
  );
}

export function useUserDeletionMutation() {
  const router = useRouter();
  const apiMutateOptions = useApiMutateOptimisticOptions<
    IAccountProfile[],
    string
  >({
    dataQueryPath: ADMIN_USERS_CRUD_CONFIG.ENDPOINTS.LIST,
    onSuccessActionWithFormData: () => {
      router.replace(NAVIGATION_LINKS.USERS.LIST);
    },
    onMutate: MutationHelpers.deleteByKey("username"),
    successMessage: ADMIN_USERS_CRUD_CONFIG.MUTATION_LANG.DELETE,
  });

  return useMutation(
    async (username: string) =>
      await makeActionRequest(
        "DELETE",
        ADMIN_USERS_CRUD_CONFIG.ENDPOINTS.DELETE(username)
      ),
    apiMutateOptions
  );
}

export function useUpdateUserMutation() {
  const username = useUsernameFromRouteParam();
  const apiMutateOptions = useWaitForResponseMutationOptions<void>({
    endpoints: [
      ADMIN_USERS_CRUD_CONFIG.ENDPOINTS.LIST,
      ADMIN_USERS_CRUD_CONFIG.ENDPOINTS.DETAILS(username),
    ],
    successMessage: ADMIN_USERS_CRUD_CONFIG.MUTATION_LANG.EDIT,
  });

  return useMutation(
    async (data: Partial<IAccountProfile>) =>
      await makeActionRequest(
        "PATCH",
        ADMIN_USERS_CRUD_CONFIG.ENDPOINTS.UPDATE(username),
        data
      ),
    apiMutateOptions
  );
}

export function useResetUserPasswordMutation() {
  const username = useUsernameFromRouteParam();
  const apiMutateOptions = useWaitForResponseMutationOptions<void>({
    endpoints: [],
    successMessage: "Password Reset Successfully",
  });

  return useMutation(
    async (data: IResetPasswordForm) =>
      await makeActionRequest(
        "PATCH",
        ADMIN_USERS_CRUD_CONFIG.ENDPOINTS.CUSTOM(username, "reset-password"),
        data
      ),
    apiMutateOptions
  );
}

export function useCreateUserMutation() {
  const router = useRouter();
  const apiMutateOptions = useWaitForResponseMutationOptions<ICreateUserForm>({
    endpoints: [ADMIN_USERS_CRUD_CONFIG.ENDPOINTS.LIST],
    smartSuccessMessage: ({ username }) => ({
      message: ADMIN_USERS_CRUD_CONFIG.MUTATION_LANG.CREATE,
      action: {
        label: ADMIN_USERS_CRUD_CONFIG.MUTATION_LANG.VIEW_DETAILS,
        action: () => router.push(NAVIGATION_LINKS.USERS.DETAILS(username)),
      },
    }),
  });

  return useMutation(async (data: ICreateUserForm) => {
    await makeActionRequest(
      "POST",
      ADMIN_USERS_CRUD_CONFIG.ENDPOINTS.CREATE,
      data
    );
    return data;
  }, apiMutateOptions);
}
