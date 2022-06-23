import {
  dataNotFoundMessage,
  makePutRequest,
  useApi,
  useWaitForResponseMutationOptions,
} from "@gothicgeeks/shared";
import { useMutation } from "react-query";
import { CONFIGURATION_KEYS } from "../../../shared/configuration.constants";
import { SLUG_LOADING_VALUE } from "../../lib/routing/constants";

export const configurationApiPath = (
  key: keyof typeof CONFIGURATION_KEYS,
  entity?: string
) => (entity ? `/api/config/${key}/${entity}` : `/api/config/${key}`);

export function useAppConfiguration<T>(key: keyof typeof CONFIGURATION_KEYS) {
  return useApi<T>(configurationApiPath(key), {
    errorMessage: dataNotFoundMessage("App Configuration"),
  });
}

export function useEntityConfiguration<T>(
  key: keyof typeof CONFIGURATION_KEYS,
  entity: string
) {
  return useApi<T>(configurationApiPath(key, entity), {
    enabled: entity !== SLUG_LOADING_VALUE,
    errorMessage: dataNotFoundMessage("Entity Configuration"),
  });
}

interface IUpsertConfigMutationOptions {
  otherEndpoints?: string[];
}

export function useUpsertConfigurationMutation(
  key: keyof typeof CONFIGURATION_KEYS,
  entity?: string,
  mutationOptions?: IUpsertConfigMutationOptions
) {
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, unknown> | unknown[]
  >({
    endpoints: [
      configurationApiPath(key, entity),
      ...(mutationOptions?.otherEndpoints || []),
    ],
    successMessage: "App settings saved successfully",
  });

  return useMutation(
    async (values: Partial<Record<string, string> | unknown[]>) => {
      return await makePutRequest(configurationApiPath(key, entity), {
        data: values,
      });
    },
    apiMutateOptions
  );
}
