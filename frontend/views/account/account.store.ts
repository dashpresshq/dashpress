import {
  dataNotFoundMessage,
  makePatchRequest,
  makePostRequest,
  MutationsLang,
  useStorageApi,
  useWaitForResponseMutationOptions,
} from "@gothicgeeks/shared";
import { useMutation } from "react-query";
import { IChangePasswordForm } from "shared/form-schemas/profile/password";
import { IUpdateUserForm } from "shared/form-schemas/profile/update";
import { IAccountUser } from "shared/types";

const ACCOUNT_URL = "/api/account/mine";

export function useMyProfile() {
  return useStorageApi<IAccountUser>(ACCOUNT_URL, {
    errorMessage: dataNotFoundMessage("Your account details"),
  });
}

export function useUpdateProfileMutation() {
  const apiMutateOptions = useWaitForResponseMutationOptions<void>({
    endpoints: [ACCOUNT_URL],
    successMessage: MutationsLang.edit("Profile"),
  });

  return useMutation(
    async (data: IUpdateUserForm) => await makePatchRequest(ACCOUNT_URL, data),
    apiMutateOptions
  );
}

export function useChangePasswordMutation() {
  const apiMutateOptions = useWaitForResponseMutationOptions<void>({
    endpoints: [],
    successMessage: MutationsLang.edit("Password"),
  });

  return useMutation(
    async (data: IChangePasswordForm) =>
      await makePostRequest(`/api/account/change-password`, data),
    apiMutateOptions
  );
}
