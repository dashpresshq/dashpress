import {
  dataNotFoundMessage,
  IUseApiOptions,
  makePatchRequest,
  makePostRequest,
  useApi,
  useWaitForResponseMutationOptions,
} from "@gothicgeeks/shared";
import { AccountRole } from "backend/users/users.types";
import { ConfigrationStorage } from "frontend/hooks/configuration/storage";
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

// :eyes
function useStorageApi<T>(endPoint: string, options: IUseApiOptions<T>) {
  return useApi<T>(endPoint, {
    ...options,
    selector: (response) => {
      const data = options.selector ? options.selector(response) : response;
      ConfigrationStorage.set(response, endPoint);
      return data;
    },
    placeholderData: ConfigrationStorage.get(endPoint),
  });
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
