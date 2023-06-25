import { CRUD_CONFIG_NOT_FOUND } from "frontend/lib/crud-config";
import { useMutation } from "react-query";
import {
  IActionInstance,
  IIntegrationImplementationList,
} from "shared/types/actions";
import { useApiMutateOptimisticOptions } from "frontend/lib/data/useMutate/useApiMutateOptimisticOptions";
import { MutationHelpers } from "frontend/lib/data/useMutate/mutation-helpers";
import { makeActionRequest } from "frontend/lib/data/makeRequest";
import { useWaitForResponseMutationOptions } from "frontend/lib/data/useMutate/useWaitForResponseMutationOptions";
import { useApi } from "frontend/lib/data/useApi";
import { ActionInstanceView } from "./types";
import {
  ADMIN_ACTION_INSTANCES_CRUD_CONFIG,
  BASE_ACTIONS_ENDPOINT,
} from "./constants";

export const LIST_ACTION_INSTANCES = ({ type, id }: ActionInstanceView) => {
  if (type === "entity") {
    return `${BASE_ACTIONS_ENDPOINT}/instances/${id}`;
  }
  return `${BASE_ACTIONS_ENDPOINT}/${id}`;
};

export const useIntegrationImplementationsList = (integrationKey: string) =>
  useApi<IIntegrationImplementationList[]>(
    `${BASE_ACTIONS_ENDPOINT}/${integrationKey}/implementations`,
    {
      errorMessage: CRUD_CONFIG_NOT_FOUND("Integration Implementations"),
      enabled: !!integrationKey,
      defaultData: [],
    }
  );

export function useDeleteActionInstanceMutation(
  actionInstanceView: ActionInstanceView
) {
  const apiMutateOptions = useApiMutateOptimisticOptions<
    IActionInstance[],
    string
  >({
    dataQueryPath: LIST_ACTION_INSTANCES(actionInstanceView),
    otherEndpoints: [BASE_ACTIONS_ENDPOINT],
    successMessage: ADMIN_ACTION_INSTANCES_CRUD_CONFIG.MUTATION_LANG.DELETE,
    onMutate: MutationHelpers.deleteByKey("instanceId") as unknown as (
      oldData: IActionInstance[],
      form: string
    ) => IActionInstance[],
  });

  return useMutation(
    async (instanceId: string) =>
      await makeActionRequest(
        "DELETE",
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
      await makeActionRequest(
        "POST",
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
      await makeActionRequest(
        "PATCH",
        ADMIN_ACTION_INSTANCES_CRUD_CONFIG.ENDPOINTS.UPDATE(
          configuration.instanceId
        ),
        configuration
      ),
    apiMutateOptions
  );
}
