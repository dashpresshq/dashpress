import {
  makePatchRequest,
  MutationsLang,
  ToastService,
  useWaitForResponseMutationOptions,
} from "@hadmean/protozoa";
import { AUTHENTICATED_ACCOUNT_URL } from "frontend/hooks/auth/user.store";
import { useMutation } from "react-query";
import { IChangePasswordForm } from "shared/form-schemas/profile/password";
import { IUpdateUserForm } from "shared/form-schemas/profile/update";
import { IUserPreferences } from "shared/types/user";

export function useUpdateProfileMutation() {
  const apiMutateOptions = useWaitForResponseMutationOptions<void>({
    endpoints: [AUTHENTICATED_ACCOUNT_URL],
    successMessage: MutationsLang.edit("Profile"),
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
    successMessage: MutationsLang.edit("Preferences"),
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
    successMessage: MutationsLang.edit("Password"),
  });

  return useMutation(async (data: IChangePasswordForm) => {
    if (process.env.NEXT_PUBLIC_IS_DEMO) {
      return ToastService.success("Password can't be changed on demo account");
    }
    return await makePatchRequest(`/api/account/change-password`, data);
  }, apiMutateOptions);
}
