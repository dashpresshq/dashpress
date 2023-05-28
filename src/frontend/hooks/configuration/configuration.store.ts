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
import { ICrudConfig } from "frontend/lib/makeCrudConfig";
import { isRouterParamEnabled } from "..";

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

export function useAppConfiguration<T>(
  key: AppConfigurationKeys,
  crudConfig: ICrudConfig
) {
  return useStorageApi<T>(configurationApiPath(key), {
    errorMessage: crudConfig.TEXT_LANG.NOT_FOUND,
  });
}

export function useEntityConfiguration<T>(
  key: AppConfigurationKeys,
  entity: string,
  crudConfig: ICrudConfig
) {
  return useStorageApi<T>(configurationApiPath(key, entity), {
    enabled: isRouterParamEnabled(entity),
    errorMessage: crudConfig.TEXT_LANG.NOT_FOUND,
  });
}

interface IUpsertConfigMutationOptions {
  otherEndpoints?: string[];
}

export function useUpsertConfigurationMutation(
  key: AppConfigurationKeys,
  crudConfig: ICrudConfig,
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
    successMessage: crudConfig.MUTATION_LANG.SAVED,
  });

  return useMutation(async (values: unknown) => {
    await makePutRequest(configurationApiPath(key, entity, "PUT"), {
      data: values,
    });
    return values;
  }, apiMutateOptions);
}
