import {
  dataNotFoundMessage,
  makePatchRequest,
  makePostRequest,
  useStorageApi,
  useWaitForResponseMutationOptions,
} from "@gothicgeeks/shared";
import { AccountRole } from "backend/users/users.types";
import { useMutation } from "react-query";
import { IChangePasswordForm } from "./Password/Form";
import { IAccountProfile } from "./Profile/Form";

const ACCOUNT_URL = "/api/account/mine";

export interface IAccountUser {
  name: string;
  username: string;
  systemId?: string;
  role: AccountRole;
}

export function useMyProfile() {
  return useStorageApi<IAccountUser>(ACCOUNT_URL, {
    errorMessage: dataNotFoundMessage("Your account details"),
  });
}

export function useUpdateProfileMutation() {
  const apiMutateOptions = useWaitForResponseMutationOptions<void>({
    endpoints: [ACCOUNT_URL],
    successMessage: "Profile updated successfully",
  });

  return useMutation(
    async (data: IAccountProfile) => await makePatchRequest(ACCOUNT_URL, data),
    apiMutateOptions
  );
}

export function useChangePasswordMutation() {
  const apiMutateOptions = useWaitForResponseMutationOptions<void>({
    endpoints: [],
    successMessage: "Password changed successfully",
  });

  return useMutation(
    async (data: IChangePasswordForm) =>
      await makePostRequest(`/api/account/change-password`, data),
    apiMutateOptions
  );
}
