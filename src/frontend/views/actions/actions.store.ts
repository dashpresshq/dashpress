import {
  dataNotFoundMessage,
  makeDeleteRequest,
  makePutRequest,
  MutationsLang,
  useApi,
  useWaitForResponseMutationOptions,
} from "@hadmean/protozoa";
import { useMutation } from "react-query";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";

const INTEGRATIONS_GROUP_ENDPOINT = (group: IntegrationsConfigurationGroup) =>
  `/api/integrations/${group}`;

export const useIntegrationsConfigurationList = (
  group: IntegrationsConfigurationGroup
) =>
  useApi<Record<string, string>>(INTEGRATIONS_GROUP_ENDPOINT(group), {
    errorMessage: dataNotFoundMessage("Configuration"),
  });

// export function useIntegrationConfigurationUpdationMutation(
//   group: IntegrationsConfigurationGroup
// ) {
//   const apiMutateOptions = useWaitForResponseMutationOptions<
//     Record<string, string>
//   >({
//     endpoints: [INTEGRATIONS_GROUP_ENDPOINT(group)],
//     successMessage: MutationsLang.saved("Configuration"),
//   });

//   return useMutation(
//     async (data: { key: string; value: string }) =>
//       await makePutRequest(`/api/integrations/${group}/${data.key}`, {
//         value: data.value,
//       }),
//     apiMutateOptions
//   );
// }

// export function useIntegrationConfigurationDeletionMutation(
//   group: IntegrationsConfigurationGroup
// ) {
//   const apiMutateOptions = useWaitForResponseMutationOptions<
//     Record<string, string>
//   >({
//     endpoints: [INTEGRATIONS_GROUP_ENDPOINT(group)],
//     successMessage: MutationsLang.delete("Configuration"),
//   });

//   return useMutation(
//     async (data: { key: string }) =>
//       await makeDeleteRequest(`/api/integrations/${group}/${data.key}`),
//     apiMutateOptions
//   );
// }
