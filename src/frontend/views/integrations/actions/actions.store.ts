import { IIntegrationsList, ActionIntegrations } from "shared/types/actions";
import { CRUD_CONFIG_NOT_FOUND } from "frontend/lib/crud-config";
import { reduceStringToNumber } from "shared/lib/strings";
import { ApiRequest } from "frontend/lib/data/makeRequest";
import { useApi } from "frontend/lib/data/useApi";
import { useWaitForResponseMutationOptions } from "frontend/lib/data/useMutate/useWaitForResponseMutationOptions";
import { usePasswordStore } from "../password.store";
import { ACTION_INTEGRATIONS_CRUD_CONFIG } from "./constants";

const ACTIVE_ACTIONS_INTEGRATIONS_ENDPOINT = "/api/integrations/actions/active";

const ACTIVATION_CONFIG = (activationId: string) => {
  return `/api/integrations/actions/${activationId}/credentials`;
};

export const useIntegrationsList = () =>
  useApi<IIntegrationsList[]>("/api/integrations/actions/list", {
    errorMessage: ACTION_INTEGRATIONS_CRUD_CONFIG.TEXT_LANG.NOT_FOUND,
    defaultData: [],
  });

export const useActiveIntegrations = () =>
  useApi<ActionIntegrations[]>(ACTIVE_ACTIONS_INTEGRATIONS_ENDPOINT, {
    errorMessage: CRUD_CONFIG_NOT_FOUND(`Activated Integrations`),
    defaultData: [],
  });

export const useActivationConfiguration = (activationId: string) => {
  const rootPassword = usePasswordStore((state) => state.password);
  return useApi<Record<string, string>>(
    `${ACTIVATION_CONFIG(activationId)}?${reduceStringToNumber(rootPassword)}`,
    {
      request: {
        body: {
          _password: rootPassword,
        },
        method: "POST",
      },
      errorMessage: CRUD_CONFIG_NOT_FOUND(`Action Credentials`),
      enabled:
        !!activationId &&
        !!rootPassword &&
        activationId !== ActionIntegrations.HTTP,
      defaultData: undefined,
    }
  );
};

export function useDeactivateIntegrationMutation() {
  return useWaitForResponseMutationOptions<string>({
    mutationFn: async (activationId) =>
      await ApiRequest.DELETE(`/api/integrations/actions/${activationId}`),
    endpoints: [ACTIVE_ACTIONS_INTEGRATIONS_ENDPOINT],
    successMessage:
      ACTION_INTEGRATIONS_CRUD_CONFIG.MUTATION_LANG.CUSTOM("Deactivated"),
  });
}

export function useActivateIntegrationMutation(integration: string) {
  return useWaitForResponseMutationOptions<Record<string, string>>({
    mutationFn: async (configuration) =>
      await ApiRequest.POST(
        `/api/integrations/actions/${integration}`,
        configuration
      ),
    endpoints: [ACTIVE_ACTIONS_INTEGRATIONS_ENDPOINT],
    successMessage:
      ACTION_INTEGRATIONS_CRUD_CONFIG.MUTATION_LANG.CUSTOM("Activated"),
  });
}

export function useUpdateActivatedIntegrationMutation(activationId: string) {
  const rootPassword = usePasswordStore((state) => state.password);

  return useWaitForResponseMutationOptions<Record<string, string>>({
    mutationFn: async (configuration) =>
      await ApiRequest.PATCH(`/api/integrations/actions/${activationId}`, {
        ...configuration,
        _password: rootPassword,
      }),
    endpoints: [ACTIVE_ACTIONS_INTEGRATIONS_ENDPOINT],
    successMessage: ACTION_INTEGRATIONS_CRUD_CONFIG.MUTATION_LANG.EDIT,
  });
}
