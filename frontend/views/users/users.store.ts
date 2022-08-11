import {
  dataNotFoundMessage,
  makeDeleteRequest,
  makePatchRequest,
  makePostRequest,
  MutationsLang,
  useApi,
  useWaitForResponseMutationOptions,
} from "@gothicgeeks/shared";
import { isRouterParamEnabled } from "frontend/hooks";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { ICreateUserForm } from "shared/form-schemas/users/create";
import { IResetPasswordForm } from "shared/form-schemas/users/reset-password";
import { IAccountUser } from "shared/types";
import { useUsernameFromRouteParam } from "./hooks";

export const ADMIN_USERS_LIST_ENDPOINT = "/api/account";

export const ADMIN_USER_DETAILS_ENDPOINT = (username: string) =>
  `/api/account/${username}`;

export function useUserDetails(username: string) {
  return useApi<IAccountUser>(ADMIN_USER_DETAILS_ENDPOINT(username), {
    enabled: isRouterParamEnabled(username),
    errorMessage: dataNotFoundMessage("User details"),
  });
}

export function useUserDeletionMutation() {
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [ADMIN_USERS_LIST_ENDPOINT],
    redirect: NAVIGATION_LINKS.USERS.LIST,
    successMessage: MutationsLang.delete("User"),
  });

  return useMutation(
    async (username: string) =>
      await makeDeleteRequest(`/api/account/${username}`),
    apiMutateOptions
  );
}

export function useUpdateUserMutation() {
  const username = useUsernameFromRouteParam();
  const apiMutateOptions = useWaitForResponseMutationOptions<void>({
    endpoints: [
      ADMIN_USERS_LIST_ENDPOINT,
      ADMIN_USER_DETAILS_ENDPOINT(username),
    ],
    successMessage: MutationsLang.edit("User"),
  });

  return useMutation(
    async (data: Partial<IAccountUser>) =>
      await makePatchRequest(ADMIN_USER_DETAILS_ENDPOINT(username), data),
    apiMutateOptions
  );
}

export function useResetUserPasswordMutation() {
  const username = useUsernameFromRouteParam();
  const apiMutateOptions = useWaitForResponseMutationOptions<void>({
    endpoints: [],
    successMessage: MutationsLang.edit("Password"),
  });

  return useMutation(
    async (data: IResetPasswordForm) =>
      await makePostRequest(`/api/account/${username}/reset-password`, data),
    apiMutateOptions
  );
}

export function useCreateUserMutation() {
  const router = useRouter();
  const apiMutateOptions = useWaitForResponseMutationOptions<ICreateUserForm>({
    endpoints: [ADMIN_USERS_LIST_ENDPOINT],
    smartSuccessMessage: ({ username }) => ({
      message: MutationsLang.create("User"),
      action: {
        label: `Click here to view user`,
        action: () => router.push(NAVIGATION_LINKS.USERS.DETAILS(username)),
      },
    }),
    successMessage: MutationsLang.create("User"),
  });

  return useMutation(async (data: ICreateUserForm) => {
    await makePostRequest(ADMIN_USERS_LIST_ENDPOINT, data);
    return data;
  }, apiMutateOptions);
}
