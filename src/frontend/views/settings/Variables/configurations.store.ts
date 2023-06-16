import {
  MutationHelpers,
  getQueryCachekey,
  makeDeleteRequest,
  makePutRequest,
  useApi,
  useApiMutateOptimisticOptions,
  useWaitForResponseMutationOptions,
} from "@hadmean/protozoa";
import { usePasswordStore } from "frontend/views/integrations/password.store";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { reduceStringToNumber } from "shared/lib/templates/reduceStringToNumber";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { INTEGRATIONS_GROUP_CONFIG } from "shared/config-bag/integrations";
import { CRUD_CONFIG_NOT_FOUND } from "frontend/lib/makeCrudConfig";
import { IKeyValue } from "./types";

export const INTEGRATIONS_GROUP_ENDPOINT = (
  group: IntegrationsConfigurationGroup
) => `/api/integrations/${group}`;

const REVEAL_CREDENTIALS_ENDPOINT = `/api/integrations/credentials/reveal`;

export function useIntegrationConfigurationUpsertationMutation(
  group: IntegrationsConfigurationGroup
) {
  const rootPassword = usePasswordStore((state) => state.password);

  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: rootPassword
      ? [REVEAL_CREDENTIALS_ENDPOINT, INTEGRATIONS_GROUP_ENDPOINT(group)]
      : [INTEGRATIONS_GROUP_ENDPOINT(group)],
    successMessage:
      INTEGRATIONS_GROUP_CONFIG[group].crudConfig.MUTATION_LANG.SAVED,
  });

  return useMutation(
    async (data: { key: string; value: string }) =>
      await makePutRequest(`/api/integrations/${group}/${data.key}`, {
        value: data.value,
        _password: rootPassword,
      }),
    apiMutateOptions
  );
}

export function useIntegrationConfigurationDeletionMutation(
  group: IntegrationsConfigurationGroup
) {
  const rootPassword = usePasswordStore((state) => state.password);

  const apiMutateOptions = useApiMutateOptimisticOptions<IKeyValue[], string>({
    dataQueryPath: INTEGRATIONS_GROUP_ENDPOINT(group),
    otherEndpoints: rootPassword ? [REVEAL_CREDENTIALS_ENDPOINT] : [],
    successMessage:
      INTEGRATIONS_GROUP_CONFIG[group].crudConfig.MUTATION_LANG.DELETE,
    onMutate: MutationHelpers.deleteByKey("key"),
  });

  return useMutation(
    async (key: string) =>
      await makeDeleteRequest(`/api/integrations/${group}/${key}`, {
        _password: rootPassword,
      }),
    apiMutateOptions
  );
}

export const useRevealedCredentialsList = (
  group: IntegrationsConfigurationGroup
) => {
  const [rootPassword, setIsPasswordValid] = usePasswordStore((state) => [
    state.password,
    state.setIsPasswordValid,
  ]);
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
      defaultData: [],
    }
  );

  useEffect(() => {
    setIsPasswordValid();
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
