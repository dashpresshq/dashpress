import {
  makeDeleteRequest,
  makePatchRequest,
  makePostRequest,
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
import { CRUD_CONFIG_NOT_FOUND } from "frontend/lib/makeCrudConfig";
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
  useApi<IActivatedAction[]>(ACTIVE_ACTIONS_INTEGRATIONS_ENDPOINT, {
    errorMessage: CRUD_CONFIG_NOT_FOUND("Active Actions"),
    defaultData: [],
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
      errorMessage: CRUD_CONFIG_NOT_FOUND("Action Credentials"),
      enabled:
        !!activationId &&
        !!rootPassword &&
        activationId !== HTTP_INTEGRATION_KEY,
      defaultData: {},
    }
  );
};

export function useDeactivateActionMutation() {
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [ACTIVE_ACTIONS_INTEGRATIONS_ENDPOINT],
    successMessage: ACTION_INTEGRATIONS_CRUD_CONFIG.MUTATION_LANG.DE_ACTIVATED,
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
    successMessage: ACTION_INTEGRATIONS_CRUD_CONFIG.MUTATION_LANG.ACTIVATED,
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
    successMessage: ACTION_INTEGRATIONS_CRUD_CONFIG.MUTATION_LANG.EDIT,
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
