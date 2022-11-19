import {
  dataNotFoundMessage,
  makeDeleteRequest,
  makePatchRequest,
  makePostRequest,
  MutationsLang,
  useApi,
  useWaitForResponseMutationOptions,
} from "@hadmean/protozoa";
import { useMutation } from "react-query";
import { IActionsList, IActivatedAction } from "shared/types/actions";

const ACTIVE_ACTIONS_ENDPOINT = "/api/actions/active";

export const useActionsList = () =>
  useApi<IActionsList[]>("/api/actions", {
    errorMessage: dataNotFoundMessage("Actions"),
  });

export const useActiveActionList = () =>
  useApi<IActivatedAction[]>(ACTIVE_ACTIONS_ENDPOINT, {
    errorMessage: dataNotFoundMessage("Active Actions"),
  });

export function useDeactivateActionMutation() {
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [ACTIVE_ACTIONS_ENDPOINT],
    successMessage: MutationsLang.delete("Action"),
  });

  return useMutation(
    async (activationId: string) =>
      await makeDeleteRequest(`/api/actions/${activationId}`),
    apiMutateOptions
  );
}

export function useActivateActionMutation(integrationKey: string) {
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [ACTIVE_ACTIONS_ENDPOINT],
    successMessage: MutationsLang.create("Action"),
  });

  return useMutation(
    async (configuration: Record<string, string>) =>
      await makePostRequest(`/api/actions/${integrationKey}`, configuration),
    apiMutateOptions
  );
}

export function useUpdateActivatedActionMutation(activationId: string) {
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [ACTIVE_ACTIONS_ENDPOINT],
    successMessage: MutationsLang.saved("Action"),
  });

  return useMutation(
    async (configuration: Record<string, string>) =>
      await makePatchRequest(`/api/actions/${activationId}`, configuration),
    apiMutateOptions
  );
}
