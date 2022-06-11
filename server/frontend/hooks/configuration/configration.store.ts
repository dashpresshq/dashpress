import {
  dataNotFoundMessage,
  makePatchRequest,
  MutationHelpers,
  useApi,
  useApiMutateOptions,
} from "@gothicgeeks/shared";
import { useMutation } from "react-query";
import { CONFIGURATION_KEYS } from "../../../shared/configuration.constants";
import { SLUG_LOADING_VALUE } from "../../lib/routing/constants";

const apiPath = (key: keyof typeof CONFIGURATION_KEYS, entity?: string) =>
  entity ? `/api/config/${key}/${entity}` : `/api/config/${key}`;

export function useAppConfiguration<T>(key: keyof typeof CONFIGURATION_KEYS) {
  return useApi<T>(apiPath(key), {
    errorMessage: dataNotFoundMessage("App Configuration"),
  });
}

export function useEntityConfiguration<T>(key: keyof typeof CONFIGURATION_KEYS, entity: string) {
  return useApi<T>(apiPath(key, entity), {
    enabled: entity !== SLUG_LOADING_VALUE,
    errorMessage: dataNotFoundMessage("Entity Configuration"),
  });
}

export function useUpsertConfigurationMutation(key: keyof typeof CONFIGURATION_KEYS, entity?: string) {
  const apiMutateOptions = useApiMutateOptions<
    Record<string, string> | unknown[],
    Partial<Record<string, string> | unknown[]>
  >({
    dataQueryPath: apiPath(key, entity),
    onMutate: MutationHelpers.mergeObject,
    successMessage: "App settings saved successfully",
  });

  return useMutation(
    async (values: Partial<Record<string, string> | unknown[]>) => {
      // TODO replace with makePutRequest
      return await makePatchRequest(apiPath(key, entity), { data: values });
    },
    apiMutateOptions
  );
}
