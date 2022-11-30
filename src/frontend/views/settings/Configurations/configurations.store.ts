import {
  makeDeleteRequest,
  makePutRequest,
  MutationsLang,
  useWaitForResponseMutationOptions,
} from "@hadmean/protozoa";
import { useMutation } from "react-query";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { INTEGRATIONS_GROUP_LABEL } from "./constants";

export const INTEGRATIONS_GROUP_ENDPOINT = (
  group: IntegrationsConfigurationGroup
) => `/api/integrations/${group}`;

export function useIntegrationConfigurationUpdationMutation(
  group: IntegrationsConfigurationGroup
) {
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [INTEGRATIONS_GROUP_ENDPOINT(group)],
    successMessage: MutationsLang.saved(
      INTEGRATIONS_GROUP_LABEL[group].singular
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
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [INTEGRATIONS_GROUP_ENDPOINT(group)],
    successMessage: MutationsLang.delete(
      INTEGRATIONS_GROUP_LABEL[group].singular
    ),
  });

  return useMutation(
    async (key: string) =>
      await makeDeleteRequest(`/api/integrations/${group}/${key}`),
    apiMutateOptions
  );
}
