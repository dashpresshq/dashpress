import {
  dataNotFoundMessage,
  makeDeleteRequest,
  makePatchRequest,
  makePostRequest,
  MutationsLang,
  useApi,
  useWaitForResponseMutationOptions,
} from "@hadmean/protozoa";
import { MAKE_API_CRUD_ENDPOINTS } from "frontend/lib/routing/makeCrudRoutes";
import { useMutation } from "react-query";
import {
  IActionInstance,
  IIntegrationImplementationList,
} from "shared/types/actions";

const BASE_ACTIONS_ENDPOINT = `/api/integrations/actions`;

const SINGULAR = `Form Integration`;

export const LIST_ACTION_INSTANCES = ({
  entity,
  integrationKey,
}: {
  entity?: string;
  integrationKey?: string;
}) => {
  if (entity) {
    return `${BASE_ACTIONS_ENDPOINT}/instances/${entity}`;
  }
  return `${BASE_ACTIONS_ENDPOINT}/${integrationKey}`;
};

export const ADMIN_ACTION_INSTANCES_API_ENDPOINTS = MAKE_API_CRUD_ENDPOINTS(
  `${BASE_ACTIONS_ENDPOINT}/instances`
);

export const useIntegrationImplementationsList = (integrationKey: string) =>
  useApi<IIntegrationImplementationList[]>(
    `${BASE_ACTIONS_ENDPOINT}/${integrationKey}/implementations`,
    {
      errorMessage: dataNotFoundMessage("Integration Implementations"),
      enabled: !!integrationKey,
    }
  );

export function useDeleteActionInstanceMutation() {
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [BASE_ACTIONS_ENDPOINT],
    successMessage: MutationsLang.delete(SINGULAR),
  });

  return useMutation(
    async (instanceId: string) =>
      await makeDeleteRequest(
        ADMIN_ACTION_INSTANCES_API_ENDPOINTS.DELETE(instanceId)
      ),
    apiMutateOptions
  );
}

export function useCreateActionInstanceMutation() {
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [BASE_ACTIONS_ENDPOINT],
    successMessage: MutationsLang.create(SINGULAR),
  });

  return useMutation(
    async (configuration: IActionInstance) =>
      await makePostRequest(
        ADMIN_ACTION_INSTANCES_API_ENDPOINTS.CREATE,
        configuration
      ),
    apiMutateOptions
  );
}

export function useUpdateActionInstanceMutation() {
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [BASE_ACTIONS_ENDPOINT],
    successMessage: MutationsLang.saved(SINGULAR),
  });

  return useMutation(
    async (configuration: IActionInstance) =>
      await makePatchRequest(
        ADMIN_ACTION_INSTANCES_API_ENDPOINTS.UPDATE(configuration.instanceId),
        configuration
      ),
    apiMutateOptions
  );
}
