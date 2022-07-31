import {
  AuthService,
  dataNotFoundMessage,
  makePostRequest,
  useApi,
  useWaitForResponseMutationOptions,
} from "@gothicgeeks/shared";
import { IUserSetupForm } from "frontend/views/setup/User/Form";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import {
  IDBCrendentials,
  ISetupCheck,
  ISuccessfullAuthenticationResponse,
} from "shared/types";
import { NAVIGATION_LINKS } from "../../lib/routing/links";
import { ConfigrationStorage } from "../configuration/storage";

const SETUP_URL = "/api/setup/check";

export function useSetupCheck() {
  const router = useRouter();
  const { isLoading, data } = useApi<ISetupCheck>(SETUP_URL, {
    placeholderData: ConfigrationStorage.get(SETUP_URL),
    selector: (response) => {
      ConfigrationStorage.set(response, SETUP_URL);
      return data;
    },
    errorMessage: dataNotFoundMessage("Setup Check"),
  });
  if (!isLoading) {
    if (!data.hasDbCredentials) {
      router.replace(NAVIGATION_LINKS.SETUP.CREDENTIALS);
    } else if (!data.hasUsers) {
      router.replace(NAVIGATION_LINKS.SETUP.USER);
    }
    return true;
  }

  return isLoading;
}

export function useSetupCredentialsMutation() {
  const router = useRouter();
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [SETUP_URL],
    successMessage: "Credential setup successfully",
    onSuccessActionWithFormData: () => {
      router.push(NAVIGATION_LINKS.SETUP.USER);
    },
  });

  return useMutation(
    async (data: IDBCrendentials) =>
      await makePostRequest(`/api/setup/credentials`, data),
    apiMutateOptions
  );
}

export function useSetupUserMutation() {
  const router = useRouter();
  const apiMutateOptions =
    useWaitForResponseMutationOptions<ISuccessfullAuthenticationResponse>({
      endpoints: [SETUP_URL],
      successMessage: "User setup successfully",
      onSuccessActionWithFormData: (response) => {
        AuthService.setAuthToken(response.token, true);

        router.push(NAVIGATION_LINKS.DASHBOARD);
      },
    });

  return useMutation(
    async (data: IUserSetupForm) =>
      await makePostRequest(`/api/setup/user`, data),
    apiMutateOptions
  );
}
