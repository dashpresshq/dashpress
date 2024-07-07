import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import {
  CRUD_CONFIG_NOT_FOUND,
  useDomainMessages,
} from "@/frontend/lib/crud-config";
import { getQueryCachekey } from "@/frontend/lib/data/constants/getQueryCacheKey";
import { ApiRequest } from "@/frontend/lib/data/makeRequest";
import { useApi } from "@/frontend/lib/data/useApi";
import { MutationHelpers } from "@/frontend/lib/data/useMutate/mutation-helpers";
import { useApiMutateOptimisticOptions } from "@/frontend/lib/data/useMutate/useApiMutateOptimisticOptions";
import { useWaitForResponseMutationOptions } from "@/frontend/lib/data/useMutate/useWaitForResponseMutationOptions";
import { objectToQueryParams } from "@/frontend/lib/routing/queryObjectToQueryString";
import { usePasswordStore } from "@/frontend/views/integrations/password.store";
import { reduceStringToNumber } from "@/shared/lib/strings";
import { IntegrationsConfigurationGroup } from "@/shared/types/integrations";
import type { IKeyValue } from "@/shared/types/options";

import { INTEGRATIONS_GROUP_CRUD_CONFIG } from "./constants";

export const INTEGRATIONS_GROUP_ENDPOINT = (
  group: IntegrationsConfigurationGroup
) => `/api/integrations/${group}`;

const REVEAL_CREDENTIALS_ENDPOINT = `/api/integrations/credentials/reveal`;

export function useIntegrationConfigurationUpsertationMutation(
  group: IntegrationsConfigurationGroup
) {
  const rootPassword = usePasswordStore((state) => state.password);
  const domainMessages = useDomainMessages(
    INTEGRATIONS_GROUP_CRUD_CONFIG[group].domainDiction
  );
  return useWaitForResponseMutationOptions<{ key: string; value: string }>({
    mutationFn: async (data) =>
      await ApiRequest.PUT(`/api/integrations/${group}/${data.key}`, {
        value: data.value,
        _password: rootPassword,
      }),
    endpoints: rootPassword
      ? [REVEAL_CREDENTIALS_ENDPOINT, INTEGRATIONS_GROUP_ENDPOINT(group)]
      : [INTEGRATIONS_GROUP_ENDPOINT(group)],
    successMessage: { description: domainMessages.MUTATION_LANG.SAVED },
  });
}

export function useIntegrationConfigurationDeletionMutation(
  group: IntegrationsConfigurationGroup
) {
  const rootPassword = usePasswordStore((state) => state.password);
  const domainMessages = useDomainMessages(
    INTEGRATIONS_GROUP_CRUD_CONFIG[group].domainDiction
  );
  return useApiMutateOptimisticOptions<IKeyValue[], string>({
    mutationFn: async (key) =>
      await ApiRequest.DELETE(
        `/api/integrations/${group}/${key}${objectToQueryParams({
          _password: rootPassword,
        })}`
      ),
    dataQueryPath: INTEGRATIONS_GROUP_ENDPOINT(group),
    otherEndpoints: rootPassword ? [REVEAL_CREDENTIALS_ENDPOINT] : [],
    successMessage: { description: domainMessages.MUTATION_LANG.DELETE },
    onMutate: MutationHelpers.deleteByKey("key"),
  });
}

export const useRevealedCredentialsList = (
  group: IntegrationsConfigurationGroup
) => {
  const rootPassword = usePasswordStore((state) => state.password);
  const queryClient = useQueryClient();

  const response = useApi<IKeyValue[]>(
    `${REVEAL_CREDENTIALS_ENDPOINT}?${reduceStringToNumber(rootPassword)}`,
    {
      request: {
        body: {
          _password: rootPassword,
        },
        method: "POST",
      },
      errorMessage: CRUD_CONFIG_NOT_FOUND("Revealed Credentials"),
      enabled:
        group === IntegrationsConfigurationGroup.Credentials && !!rootPassword,
      defaultData: undefined,
    }
  );

  useEffect(() => {
    if (response.data && response.data.length) {
      queryClient.setQueryData(
        getQueryCachekey(
          INTEGRATIONS_GROUP_ENDPOINT(
            IntegrationsConfigurationGroup.Credentials
          )
        ),
        response.data
      );
    }
  }, [response.data]);

  return response;
};
