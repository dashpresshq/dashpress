import {
  makePatchRequest,
  MutationsLang,
  useWaitForResponseMutationOptions,
} from "@adminator/protozoa";
import { AUTHENTICATED_ACCOUNT_URL } from "frontend/hooks/auth/user.store";
import { useMutation } from "react-query";
import { IChangePasswordForm } from "shared/form-schemas/profile/password";
import { IUpdateUserForm } from "shared/form-schemas/profile/update";

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

export function useChangePasswordMutation() {
  const apiMutateOptions = useWaitForResponseMutationOptions<void>({
    endpoints: [],
    successMessage: MutationsLang.edit("Password"),
  });

  return useMutation(
    async (data: IChangePasswordForm) =>
      await makePatchRequest(`/api/account/change-password`, data),
    apiMutateOptions
  );
}
