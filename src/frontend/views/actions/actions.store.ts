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
  HTTP_INTEGRATION_KEY,
  IIntegrationsList,
  IActivatedAction,
} from "shared/types/actions";
import { usePasswordStore } from "./password.store";

const ACTIVE_ACTIONS_INTEGRATIONS_ENDPOINT = "/api/integrations/actions/active";

const ACTIVATION_CONFIG = (activationId: string) => {
  return `/api/integrations/actions/${activationId}/credentials`;
};

export const useActionIntegrationsList = () =>
  useApi<IIntegrationsList[]>("/api/integrations/actions/list", {
    errorMessage: dataNotFoundMessage("Actions Integrations"),
  });

export const useActiveActionList = () =>
  useApi<IActivatedAction[]>(ACTIVE_ACTIONS_INTEGRATIONS_ENDPOINT, {
    errorMessage: dataNotFoundMessage("Active Actions"),
  });

export const useActivationConfiguration = (activationId: string) => {
  const rootPassword = usePasswordStore((state) => state.password);
  return useApi<Record<string, string>>(
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
        !!activationId &&
        !!rootPassword &&
        activationId !== HTTP_INTEGRATION_KEY,
    }
  );
};

export function useDeactivateActionMutation() {
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [ACTIVE_ACTIONS_INTEGRATIONS_ENDPOINT],
    successMessage: "Action Integration Deactivated Successfully",
  });

  return useMutation(
    async (activationId: string) =>
      await makeDeleteRequest(`/api/integrations/actions/${activationId}`),
    apiMutateOptions
  );
}

export function useActivateActionMutation(integrationKey: string) {
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [ACTIVE_ACTIONS_INTEGRATIONS_ENDPOINT],
    successMessage: "Action Integration Activated Successfully",
  });

  return useMutation(
    async (configuration: Record<string, string>) =>
      await makePostRequest(
        `/api/integrations/actions/${integrationKey}`,
        configuration
      ),
    apiMutateOptions
  );
}

export function useUpdateActivatedActionMutation(activationId: string) {
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [ACTIVE_ACTIONS_INTEGRATIONS_ENDPOINT],
    successMessage: MutationsLang.saved("Action Integration"),
  });

  return useMutation(
    async (configuration: Record<string, string>) =>
      await makePatchRequest(
        `/api/integrations/actions/${activationId}`,
        configuration
      ),
    apiMutateOptions
  );
}
