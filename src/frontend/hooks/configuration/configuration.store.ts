import { useMutation } from "react-query";
import {
  APP_CONFIGURATION_CONFIG,
  AppConfigurationKeys,
} from "shared/configurations";
import { makeActionRequest } from "frontend/lib/data/makeRequest";
import { useStorageApi } from "frontend/lib/data/useApi";
import { useWaitForResponseMutationOptions } from "frontend/lib/data/useMutate/useWaitForResponseMutationOptions";
import { AppStorage } from "frontend/lib/storage/app";
import { isRouterParamEnabled } from "..";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "./configuration.constant";

// :eyes
export const configurationApiPath = (
  key: AppConfigurationKeys,
  entity?: string,
  method: "GET" | "PUT" = "GET"
) => {
  if (entity) {
    return `/api/config/${key}/${entity}`;
  }

  if (method === "PUT") {
    return `/api/config/${key}`;
  }

  if (APP_CONFIGURATION_CONFIG[key].guest) {
    return `/api/config/${key}/__guest`;
  }

  return `/api/config/${key}`;
};

export function useAppConfiguration<T>(key: AppConfigurationKeys) {
  return useStorageApi<T>(configurationApiPath(key), {
    errorMessage: MAKE_APP_CONFIGURATION_CRUD_CONFIG(key).TEXT_LANG.NOT_FOUND,
    defaultData: APP_CONFIGURATION_CONFIG[key].defaultValue as T,
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
      forceDefaultValue || (APP_CONFIGURATION_CONFIG[key].defaultValue as T),
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
    await makeActionRequest("PUT", configurationApiPath(key, entity, "PUT"), {
      data: values,
    });
    return values;
  }, apiMutateOptions);
}
