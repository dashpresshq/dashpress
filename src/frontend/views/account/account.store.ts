import {
  makePatchRequest,
  useWaitForResponseMutationOptions,
} from "@hadmean/protozoa";
import { AUTHENTICATED_ACCOUNT_URL } from "frontend/hooks/auth/user.store";
import { useMutation } from "react-query";
import { IChangePasswordForm } from "shared/form-schemas/profile/password";
import { IUpdateUserForm } from "shared/form-schemas/profile/update";
import { IUserPreferences } from "shared/types/user";
import { ACCOUNT_PROFILE_CRUD_CONFIG } from "frontend/hooks/auth/constants";
import {
  ACCOUNT_PREFERENCES_CRUD_CONFIG,
  PASSWORD_CRUD_CONFIG,
} from "./constants";

export function useUpdateProfileMutation() {
  const apiMutateOptions = useWaitForResponseMutationOptions<void>({
    endpoints: [AUTHENTICATED_ACCOUNT_URL],
    successMessage: ACCOUNT_PROFILE_CRUD_CONFIG.MUTATION_LANG.SAVED,
  });

  return useMutation(
    async (data: IUpdateUserForm) =>
      await makePatchRequest(AUTHENTICATED_ACCOUNT_URL, data),
    apiMutateOptions
  );
}

export function useUpdateUserPreferencesMutation() {
  const apiMutateOptions = useWaitForResponseMutationOptions<void>({
    endpoints: [AUTHENTICATED_ACCOUNT_URL],
    successMessage: ACCOUNT_PREFERENCES_CRUD_CONFIG.MUTATION_LANG.SAVED,
  });

  return useMutation(
    async (data: IUserPreferences) =>
      await makePatchRequest("/api/account/preferences", data),
    apiMutateOptions
  );
}

export function useChangePasswordMutation() {
  const apiMutateOptions = useWaitForResponseMutationOptions<void>({
    endpoints: [],
    successMessage: process.env.NEXT_PUBLIC_IS_DEMO
      ? "Password will not be changed on demo account"
      : PASSWORD_CRUD_CONFIG.MUTATION_LANG.EDIT,
  });

  return useMutation(async (data: IChangePasswordForm) => {
    return await makePatchRequest(`/api/account/change-password`, data);
  }, apiMutateOptions);
}
