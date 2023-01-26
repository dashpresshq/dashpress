import {
  AppStorage,
  dataNotFoundMessage,
  makePutRequest,
  MutationsLang,
  useStorageApi,
  useWaitForResponseMutationOptions,
  SLUG_LOADING_VALUE,
} from "@hadmean/protozoa";
import { useMutation } from "react-query";
import {
  CONFIGURATION_KEYS,
  AppConfigurationKeys,
} from "shared/configurations";

export const configurationApiPath = (
  key: AppConfigurationKeys,
  entity?: string,
  method: "GET" | "PUT" = "GET"
) => {
  if (entity) {
    return `/api/config/${key}/${entity}`;
  }

  if (CONFIGURATION_KEYS[key].guest && method === "GET") {
    return `/api/config/${key}/__guest`;
  }

  return `/api/config/${key}`;
};

export function useAppConfiguration<T>(key: AppConfigurationKeys) {
  return useStorageApi<T>(configurationApiPath(key), {
    errorMessage: dataNotFoundMessage("App Configuration"),
  });
}

export function useEntityConfiguration<T>(
  key: AppConfigurationKeys,
  entity: string
) {
  return useStorageApi<T>(configurationApiPath(key, entity), {
    enabled: entity !== SLUG_LOADING_VALUE,
    errorMessage: dataNotFoundMessage("Entity Configuration"),
  });
}

interface IUpsertConfigMutationOptions {
  otherEndpoints?: string[];
}

export function useUpsertConfigurationMutation(
  key: AppConfigurationKeys,
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
    onSuccessActionWithFormData: (data) => {
      AppStorage.set(configurationApiPath(key, entity), data);
    },
    successMessage: MutationsLang.saved("App Settings"),
  });

  return useMutation(async (values: unknown) => {
    await makePutRequest(configurationApiPath(key, entity, "PUT"), {
      data: values,
    });
    return values;
  }, apiMutateOptions);
}
