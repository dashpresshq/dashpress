import {
  dataNotFoundMessage,
  getQueryCachekey,
  makeDeleteRequest,
  makePutRequest,
  MutationsLang,
  useApi,
  useWaitForResponseMutationOptions,
} from "@hadmean/protozoa";
import { usePasswordStore } from "frontend/views/integrations/password.store";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { reduceStringToNumber } from "shared/lib/templates/reduceStringToNumber";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { INTEGRATIONS_GROUP_CONFIG } from "./constants";
import { IKeyValue } from "./types";

export const INTEGRATIONS_GROUP_ENDPOINT = (
  group: IntegrationsConfigurationGroup
) => `/api/integrations/${group}`;

const REVEAL_CREDENTIALS_ENDPOINT = `/api/integrations/credentials/reveal`;

export function useIntegrationConfigurationUpdationMutation(
  group: IntegrationsConfigurationGroup
) {
  const rootPassword = usePasswordStore((state) => state.password);

  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: rootPassword
      ? [REVEAL_CREDENTIALS_ENDPOINT, INTEGRATIONS_GROUP_ENDPOINT(group)]
      : [INTEGRATIONS_GROUP_ENDPOINT(group)],
    successMessage: MutationsLang.saved(
      INTEGRATIONS_GROUP_CONFIG[group].singular
    ),
  });

  return useMutation(
    async (data: { key: string; value: string }) =>
      await makePutRequest(`/api/integrations/${group}/${data.key}`, {
        value: data.value,
      }),
    apiMutateOptions
  );
}

export function useIntegrationConfigurationDeletionMutation(
  group: IntegrationsConfigurationGroup
) {
  const rootPassword = usePasswordStore((state) => state.password);

  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: rootPassword
      ? [REVEAL_CREDENTIALS_ENDPOINT, INTEGRATIONS_GROUP_ENDPOINT(group)]
      : [INTEGRATIONS_GROUP_ENDPOINT(group)],
    successMessage: MutationsLang.delete(
      INTEGRATIONS_GROUP_CONFIG[group].singular
    ),
  });

  return useMutation(
    async (key: string) =>
      await makeDeleteRequest(`/api/integrations/${group}/${key}`),
    apiMutateOptions
  );
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
          password: rootPassword,
        },
        method: "POST",
      },
      errorMessage: dataNotFoundMessage("Revealed Credentials"),
      enabled:
        group === IntegrationsConfigurationGroup.Credentials && !!rootPassword,
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
