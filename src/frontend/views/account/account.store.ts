import { AUTHENTICATED_ACCOUNT_URL } from "frontend/hooks/auth/user.store";
import { IChangePasswordForm } from "shared/form-schemas/profile/password";
import { IUpdateProfileForm } from "shared/form-schemas/profile/update";
import { useWaitForResponseMutationOptions } from "frontend/lib/data/useMutate/useWaitForResponseMutationOptions";
import { ApiRequest } from "frontend/lib/data/makeRequest";
import { msg } from "@lingui/macro";
import { useDomainMessages } from "frontend/lib/crud-config";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";

export function useUpdateProfileMutation() {
  const domainMessages = useDomainMessages(LANG_DOMAINS.ACCOUNT.PROFILE);
  return useWaitForResponseMutationOptions<IUpdateProfileForm>({
    mutationFn: async (data) =>
      await ApiRequest.PATCH(AUTHENTICATED_ACCOUNT_URL, data),
    endpoints: [AUTHENTICATED_ACCOUNT_URL],
    successMessage: domainMessages.MUTATION_LANG.SAVED,
  });
}

export function useChangePasswordMutation() {
  const domainMessages = useDomainMessages(LANG_DOMAINS.ACCOUNT.PASSWORD);
  return useWaitForResponseMutationOptions<IChangePasswordForm>({
    mutationFn: async (data) => {
      return await ApiRequest.PATCH(`/api/account/change-password`, data);
    },
    endpoints: [],
    successMessage: process.env.NEXT_PUBLIC_IS_DEMO
      ? msg`Password will not be changed on demo account`
      : domainMessages.MUTATION_LANG.EDIT,
  });
}
