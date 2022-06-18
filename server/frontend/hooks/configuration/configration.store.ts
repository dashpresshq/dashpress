import {
  dataNotFoundMessage,
  makePutRequest,
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
    wipData: key === "entity_columns_labels" ? {userId: "User Name"} : undefined,
    errorMessage: dataNotFoundMessage("Entity Configuration"),
  });
}

export function useUpsertConfigurationMutation(key: keyof typeof CONFIGURATION_KEYS, entity?: string) {
  const apiMutateOptions = useApiMutateOptions<
    Record<string, unknown> | unknown[],
    Partial<Record<string, unknown> | unknown[]>
  >({
    dataQueryPath: apiPath(key, entity),
    onMutate: MutationHelpers.replace,
    successMessage: "App settings saved successfully",
  });

  return useMutation(
    async (values: Partial<Record<string, string> | unknown[]>) => {
      return await makePutRequest(apiPath(key, entity), { data: values });
    },
    apiMutateOptions
  );
}
