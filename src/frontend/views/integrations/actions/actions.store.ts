import { useMutation } from "react-query";
import { IIntegrationsList, ActionIntegrationKeys } from "shared/types/actions";
import { CRUD_CONFIG_NOT_FOUND } from "frontend/lib/crud-config";
import { reduceStringToNumber } from "shared/lib/strings";
import { makeActionRequest } from "frontend/lib/data/makeRequest";
import { useApi } from "frontend/lib/data/useApi";
import { useWaitForResponseMutationOptions } from "frontend/lib/data/useMutate/useWaitForResponseMutationOptions";
import { usePasswordStore } from "../password.store";
import { ACTION_INTEGRATIONS_CRUD_CONFIG } from "./constants";

const ACTIVE_ACTIONS_INTEGRATIONS_ENDPOINT = "/api/integrations/actions/active";

const ACTIVATION_CONFIG = (activationId: string) => {
  return `/api/integrations/actions/${activationId}/credentials`;
};

export const useActionIntegrationsList = () =>
  useApi<IIntegrationsList[]>("/api/integrations/actions/list", {
    errorMessage: ACTION_INTEGRATIONS_CRUD_CONFIG.TEXT_LANG.NOT_FOUND,
    defaultData: [],
  });

export const useActiveActionList = () =>
  useApi<ActionIntegrationKeys[]>(ACTIVE_ACTIONS_INTEGRATIONS_ENDPOINT, {
    errorMessage: CRUD_CONFIG_NOT_FOUND("Activated Integrations"),
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
      errorMessage: CRUD_CONFIG_NOT_FOUND("Action Credentials"),
      enabled:
        !!activationId &&
        !!rootPassword &&
        activationId !== ActionIntegrationKeys.HTTP,
      defaultData: undefined,
    }
  );
};

export function useDeactivateActionMutation() {
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [ACTIVE_ACTIONS_INTEGRATIONS_ENDPOINT],
    successMessage:
      ACTION_INTEGRATIONS_CRUD_CONFIG.MUTATION_LANG.CUSTOM("Deactivated"),
  });

  return useMutation(
    async (activationId: string) =>
      await makeActionRequest(
        "DELETE",
        `/api/integrations/actions/${activationId}`
      ),
    apiMutateOptions
  );
}

export function useActivateActionMutation(integrationKey: string) {
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [ACTIVE_ACTIONS_INTEGRATIONS_ENDPOINT],
    successMessage:
      ACTION_INTEGRATIONS_CRUD_CONFIG.MUTATION_LANG.CUSTOM("Activated"),
  });

  return useMutation(
    async (configuration: Record<string, string>) =>
      await makeActionRequest(
        "POST",
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
    successMessage: ACTION_INTEGRATIONS_CRUD_CONFIG.MUTATION_LANG.EDIT,
  });

  const rootPassword = usePasswordStore((state) => state.password);

  return useMutation(
    async (configuration: Record<string, string>) =>
      await makeActionRequest(
        "PATCH",
        `/api/integrations/actions/${activationId}`,
        {
          ...configuration,
          _password: rootPassword,
        }
      ),
    apiMutateOptions
  );
}
