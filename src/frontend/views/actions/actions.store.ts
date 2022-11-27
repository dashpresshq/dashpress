import {
  dataNotFoundMessage,
  makeDeleteRequest,
  makePatchRequest,
  makePostRequest,
  MutationsLang,
  useApi,
  useWaitForResponseMutationOptions,
} from "@hadmean/protozoa";
import { useMutation } from "react-query";
import { reduceStringToNumber } from "shared/lib/templates/reduceStringToNumber";
import {
  HTTP_ACTION_KEY,
  IIntegrationsList,
  IActivatedAction,
} from "shared/types/actions";
import { usePasswordStore } from "./password.store";

const ACTIVE_ACTIONS_ENDPOINT = "/api/actions/active";

const ACTIVATION_CONFIG = (activationId) => {
  return `/api/actions/${activationId}/credentials`;
};

export const useIntegrationsList = () =>
  useApi<IIntegrationsList[]>("/api/actions/integrations", {
    errorMessage: dataNotFoundMessage("Integrations"),
  });

export const useActiveActionList = () =>
  useApi<IActivatedAction[]>(ACTIVE_ACTIONS_ENDPOINT, {
    errorMessage: dataNotFoundMessage("Active Actions"),
  });

export const useActivationConfiguration = (activationId: string) => {
  const rootPassword = usePasswordStore((state) => state.password);
  return useApi<IActivatedAction[]>(
    `${ACTIVATION_CONFIG(activationId)}?${reduceStringToNumber(rootPassword)}`,
    {
      request: {
        body: {
          password: rootPassword,
        },
        method: "POST",
      },
      errorMessage: dataNotFoundMessage("Action Credentials"),
      enabled:
        !!activationId && !!rootPassword && activationId !== HTTP_ACTION_KEY,
    }
  );
};

export function useDeactivateActionMutation() {
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [ACTIVE_ACTIONS_ENDPOINT],
    successMessage: "Action Deactivated Successfully",
  });

  return useMutation(
    async (activationId: string) =>
      await makeDeleteRequest(`/api/actions/${activationId}`),
    apiMutateOptions
  );
}

export function useActivateActionMutation(integrationKey: string) {
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [ACTIVE_ACTIONS_ENDPOINT],
    successMessage: "Action Activated Successfully",
  });

  return useMutation(
    async (configuration: Record<string, string>) =>
      await makePostRequest(`/api/actions/${integrationKey}`, configuration),
    apiMutateOptions
  );
}

export function useUpdateActivatedActionMutation(activationId: string) {
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [ACTIVE_ACTIONS_ENDPOINT],
    successMessage: MutationsLang.saved("Action"),
  });

  return useMutation(
    async (configuration: Record<string, string>) =>
      await makePatchRequest(`/api/actions/${activationId}`, configuration),
    apiMutateOptions
  );
}
