import {
  makePostRequest,
  MutationsLang,
  useWaitForResponseMutationOptions,
} from "@hadmean/protozoa";
import { useAuthenticateUser } from "frontend/hooks/auth/useAuthenticateUser";
import { SETUP_CHECK_URL } from "frontend/hooks/setup/setup.store";
import { useMutation } from "react-query";
import { ISetupUserForm } from "shared/form-schemas/setup/user";
import { ISuccessfullAuthenticationResponse } from "shared/types/auth";
import { IDataSourceCredentials } from "shared/types/data-sources";

export function useSetupCredentialsMutation() {
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [SETUP_CHECK_URL],
    successMessage: MutationsLang.create("Setup Credentials"),
  });

  return useMutation(
    async (data: IDataSourceCredentials) =>
      await makePostRequest(`/api/setup/credentials`, data),
    apiMutateOptions
  );
}

export function useSetupUserMutation() {
  const authenticateUser = useAuthenticateUser();

  const apiMutateOptions =
    useWaitForResponseMutationOptions<ISuccessfullAuthenticationResponse>({
      endpoints: [SETUP_CHECK_URL],
      successMessage: MutationsLang.create("User"),
      onSuccessActionWithFormData: (response) => {
        authenticateUser(response.token, true);
      },
    });

  return useMutation(
    async (data: ISetupUserForm) =>
      await makePostRequest(`/api/setup/user`, data),
    apiMutateOptions
  );
}
