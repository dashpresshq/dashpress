import {
  AppStorage,
  makePutRequest,
  useStorageApi,
  useWaitForResponseMutationOptions,
} from "@hadmean/protozoa";
import { useMutation } from "react-query";
import {
  CONFIGURATION_KEYS,
  AppConfigurationKeys,
} from "shared/configurations";
import { isRouterParamEnabled } from "..";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "./configuration.constant";

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
    errorMessage: MAKE_APP_CONFIGURATION_CRUD_CONFIG(key).TEXT_LANG.NOT_FOUND,
    defaultData: CONFIGURATION_KEYS[key].defaultValue as T,
  });
}

export function useEntityConfiguration<T>(
  key: AppConfigurationKeys,
  entity: string,
  forceDefaultValue?: T
) {
  return useStorageApi<T>(configurationApiPath(key, entity), {
    enabled: isRouterParamEnabled(entity),
    errorMessage: MAKE_APP_CONFIGURATION_CRUD_CONFIG(key).TEXT_LANG.NOT_FOUND,
    defaultData:
      forceDefaultValue || (CONFIGURATION_KEYS[key].defaultValue as T),
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
    successMessage: MAKE_APP_CONFIGURATION_CRUD_CONFIG(key).MUTATION_LANG.SAVED,
  });

  return useMutation(async (values: unknown) => {
    await makePutRequest(configurationApiPath(key, entity, "PUT"), {
      data: values,
    });
    return values;
  }, apiMutateOptions);
}
