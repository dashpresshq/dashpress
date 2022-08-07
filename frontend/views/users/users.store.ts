import {
  makeDeleteRequest,
  makePatchRequest,
  makePostRequest,
  MutationsLang,
  useWaitForResponseMutationOptions,
} from "@gothicgeeks/shared";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useMutation } from "react-query";
import { IAccountUser } from "shared/types";

export const ADMIN_USERS_LIST_ENDPOINT = "/api/account";

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
      await makeDeleteRequest(`/api/account`, { username }),
    apiMutateOptions
  );
}

export function useUpdateUserMutation() {
  const apiMutateOptions = useWaitForResponseMutationOptions<void>({
    endpoints: [ADMIN_USERS_LIST_ENDPOINT],
    successMessage: MutationsLang.edit("User"),
  });

  return useMutation(
    async (data: Partial<IAccountUser>) =>
      await makePatchRequest(ADMIN_USERS_LIST_ENDPOINT, data),
    apiMutateOptions
  );
}

export function useResetUserPasswordMutation() {
  const apiMutateOptions = useWaitForResponseMutationOptions<void>({
    endpoints: [],
    successMessage: MutationsLang.edit("Password"),
  });

  return useMutation(
    async (data: { username: string; password: string }) =>
      await makePostRequest("/api/account/reset-password", data),
    apiMutateOptions
  );
}

export function useCreateUserMutation() {
  const apiMutateOptions = useWaitForResponseMutationOptions<void>({
    endpoints: [ADMIN_USERS_LIST_ENDPOINT],
    successMessage: MutationsLang.create("User"),
  });

  return useMutation(
    async (data: IAccountUser) =>
      await makePostRequest(ADMIN_USERS_LIST_ENDPOINT, data),
    apiMutateOptions
  );
}
