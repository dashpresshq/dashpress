import {
  MutationHelpers,
  makeDeleteRequest,
  makePatchRequest,
  makePostRequest,
  useApi,
  useApiMutateOptimisticOptions,
  useWaitForResponseMutationOptions,
} from "@hadmean/protozoa";
import { CRUD_CONFIG_NOT_FOUND } from "frontend/lib/makeCrudConfig";
import { useMutation } from "react-query";
import {
  IActionInstance,
  IIntegrationImplementationList,
} from "shared/types/actions";
import {
  ADMIN_ACTION_INSTANCES_CRUD_CONFIG,
  BASE_ACTIONS_ENDPOINT,
} from "./constants";
import { ActionInstanceView } from "./types";

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
