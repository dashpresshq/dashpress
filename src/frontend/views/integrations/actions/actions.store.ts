import type { IIntegrationsList } from "shared/types/actions";
import { ActionIntegrations } from "shared/types/actions";
import {
  CRUD_CONFIG_NOT_FOUND,
  useDomainMessages,
} from "frontend/lib/crud-config";
import { reduceStringToNumber } from "shared/lib/strings";
import { ApiRequest } from "frontend/lib/data/makeRequest";
import { useApi } from "frontend/lib/data/useApi";
import { useWaitForResponseMutationOptions } from "frontend/lib/data/useMutate/useWaitForResponseMutationOptions";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";
import { msg } from "@lingui/macro";
import { usePasswordStore } from "../password.store";

const ACTIVE_ACTIONS_INTEGRATIONS_ENDPOINT = "/api/integrations/actions/active";

const ACTIVATION_CONFIG = (activationId: string) => {
  return `/api/integrations/actions/${activationId}/credentials`;
};

export const useIntegrationsList = () => {
  const domainMessages = useDomainMessages(LANG_DOMAINS.INTEGRATIONS.ACTIONS);

  return useApi<IIntegrationsList[]>("/api/integrations/actions/list", {
    errorMessage: domainMessages.TEXT_LANG.NOT_FOUND,
    defaultData: [],
  });
};

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
  const domainMessages = useDomainMessages(LANG_DOMAINS.INTEGRATIONS.ACTIONS);

  return useWaitForResponseMutationOptions<string>({
    mutationFn: async (activationId) =>
      await ApiRequest.DELETE(`/api/integrations/actions/${activationId}`),
    endpoints: [ACTIVE_ACTIONS_INTEGRATIONS_ENDPOINT],
    successMessage: {
      description: domainMessages.MUTATION_LANG.CUSTOM(msg`Deactivated`),
    },
  });
}

export function useActivateIntegrationMutation(integration: string) {
  const domainMessages = useDomainMessages(LANG_DOMAINS.INTEGRATIONS.ACTIONS);

  return useWaitForResponseMutationOptions<Record<string, string>>({
    mutationFn: async (configuration) =>
      await ApiRequest.POST(
        `/api/integrations/actions/${integration}`,
        configuration
      ),
    endpoints: [ACTIVE_ACTIONS_INTEGRATIONS_ENDPOINT],
    successMessage: {
      description: domainMessages.MUTATION_LANG.CUSTOM(msg`Activated`),
    },
  });
}

export function useUpdateActivatedIntegrationMutation(activationId: string) {
  const rootPassword = usePasswordStore((state) => state.password);
  const domainMessages = useDomainMessages(LANG_DOMAINS.INTEGRATIONS.ACTIONS);

  return useWaitForResponseMutationOptions<Record<string, string>>({
    mutationFn: async (configuration) =>
      await ApiRequest.PATCH(`/api/integrations/actions/${activationId}`, {
        ...configuration,
        _password: rootPassword,
      }),
    endpoints: [ACTIVE_ACTIONS_INTEGRATIONS_ENDPOINT],
    successMessage: { description: domainMessages.MUTATION_LANG.EDIT },
  });
}
