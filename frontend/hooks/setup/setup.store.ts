import {
  AuthService,
  dataNotFoundMessage,
  makePostRequest,
  useStorageApi,
  useWaitForResponseMutationOptions,
} from "@gothicgeeks/shared";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { ISetupUserForm } from "shared/form-schemas/setup/user";
import {
  IDBCrendentials,
  ISetupCheck,
  ISuccessfullAuthenticationResponse,
} from "shared/types";
import { NAVIGATION_LINKS } from "../../lib/routing/links";

const SETUP_URL = "/api/setup/check";

interface ISetupCheckConfig {
  key: keyof ISetupCheck;
  value: boolean;
  url: string;
}

export function useSetupCheck(config: ISetupCheckConfig[]) {
  const router = useRouter();
  const { isLoading, data } = useStorageApi<ISetupCheck>(SETUP_URL, {
    errorMessage: dataNotFoundMessage("Setup Check"),
  });
  if (isLoading) {
    return isLoading;
  }

  config.forEach((configItem) => {
    if (data[configItem.key] === configItem.value) {
      router.replace(configItem.url);
    }
  });

  return false;
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
    async (data: ISetupUserForm) =>
      await makePostRequest(`/api/setup/user`, data),
    apiMutateOptions
  );
}
