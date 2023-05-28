import {
  makeDeleteRequest,
  makePatchRequest,
  makePostRequest,
  useApi,
  dataNotFoundMessage,
  useWaitForResponseMutationOptions,
} from "@hadmean/protozoa";
import { MAKE_CRUD_CONFIG } from "frontend/lib/makeCrudConfig";
import { useMutation } from "react-query";
import {
  IActionInstance,
  IIntegrationImplementationList,
} from "shared/types/actions";

const BASE_ACTIONS_ENDPOINT = `/api/integrations/actions`;

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

export const ADMIN_ACTION_INSTANCES_CRUD_CONFIG = MAKE_CRUD_CONFIG({
  path: `${BASE_ACTIONS_ENDPOINT}/instances`,
  plural: "Form Integrations",
  singular: "Form Integration",
});

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
    successMessage: ADMIN_ACTION_INSTANCES_CRUD_CONFIG.MUTATION_LANG.DELETE,
  });

  return useMutation(
    async (instanceId: string) =>
      await makeDeleteRequest(
        ADMIN_ACTION_INSTANCES_CRUD_CONFIG.ENDPOINTS.DELETE(instanceId)
      ),
    apiMutateOptions
  );
}

export function useCreateActionInstanceMutation() {
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [BASE_ACTIONS_ENDPOINT],
    successMessage: ADMIN_ACTION_INSTANCES_CRUD_CONFIG.MUTATION_LANG.CREATE,
  });

  return useMutation(
    async (configuration: IActionInstance) =>
      await makePostRequest(
        ADMIN_ACTION_INSTANCES_CRUD_CONFIG.ENDPOINTS.CREATE,
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
    successMessage: ADMIN_ACTION_INSTANCES_CRUD_CONFIG.MUTATION_LANG.EDIT,
  });

  return useMutation(
    async (configuration: IActionInstance) =>
      await makePatchRequest(
        ADMIN_ACTION_INSTANCES_CRUD_CONFIG.ENDPOINTS.UPDATE(
          configuration.instanceId
        ),
        configuration
      ),
    apiMutateOptions
  );
}
