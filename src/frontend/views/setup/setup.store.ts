import { useAuthenticateUser } from "frontend/hooks/auth/useAuthenticateUser";
import { SETUP_CHECK_URL } from "frontend/hooks/setup/setup.store";
import { makeActionRequest } from "frontend/lib/data/makeRequest";
import { useWaitForResponseMutationOptions } from "frontend/lib/data/useMutate/useWaitForResponseMutationOptions";
import { useMutation } from "react-query";
import { ISetupUserForm } from "shared/form-schemas/setup/user";
import { ISuccessfullAuthenticationResponse } from "shared/types/auth/portal";
import { IDataSourceCredentials } from "shared/types/data-sources";

export function useSetupCredentialsMutation() {
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [SETUP_CHECK_URL],
    successMessage: "Credentials Was Successfully Setup",
  });

  return useMutation(
    async (data: IDataSourceCredentials) =>
      await makeActionRequest("POST", `/api/setup/credentials`, data),
    apiMutateOptions
  );
}

export function useSetupUserMutation() {
  const authenticateUser = useAuthenticateUser();

  const apiMutateOptions =
    useWaitForResponseMutationOptions<ISuccessfullAuthenticationResponse>({
      endpoints: [SETUP_CHECK_URL],
      successMessage: "Account Was Successfully Setup",
      onSuccessActionWithFormData: (response) => {
        authenticateUser(response.token, true);
      },
    });

  return useMutation(
    async (data: ISetupUserForm) =>
      await makeActionRequest("POST", `/api/setup/user`, data),
    apiMutateOptions
  );
}
