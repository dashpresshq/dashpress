import { msg } from "@lingui/macro";
import { useAuthenticateUser } from "frontend/hooks/auth/useAuthenticateUser";
import { SETUP_CHECK_URL } from "frontend/hooks/setup/setup.store";
import { ApiRequest } from "frontend/lib/data/makeRequest";
import { useWaitForResponseMutationOptions } from "frontend/lib/data/useMutate/useWaitForResponseMutationOptions";
import type { ISetupUserForm } from "shared/form-schemas/setup/user";
import type { ISuccessfullAuthenticationResponse } from "shared/types/auth/portal";
import type { IDataSourceCredentials } from "shared/types/data-sources";

export function useSetupCredentialsMutation() {
  return useWaitForResponseMutationOptions<IDataSourceCredentials>({
    mutationFn: async (data) =>
      await ApiRequest.POST(`/api/setup/credentials`, data),
    endpoints: [SETUP_CHECK_URL],
    successMessage: { description: msg`Credentials Was Successfully Setup` },
  });
}

export function useSetupUserMutation() {
  const authenticateUser = useAuthenticateUser();

  return useWaitForResponseMutationOptions<
    ISetupUserForm,
    ISuccessfullAuthenticationResponse
  >({
    mutationFn: async (data) => await ApiRequest.POST(`/api/setup/user`, data),
    endpoints: [SETUP_CHECK_URL],
    successMessage: { description: msg`Account Was Successfully Setup` },
    onSuccessActionWithFormData: (response) => {
      authenticateUser(response.token, true);
    },
  });
}
