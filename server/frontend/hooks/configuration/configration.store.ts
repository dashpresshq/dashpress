import {
  dataNotFoundMessage,
  makePatchRequest,
  MutationHelpers,
  useApi,
  useApiMutateOptions,
} from "@gothicgeeks/shared";
import { useMutation } from "react-query";

const apiPath = (key: string, entity?: string) =>
  entity ? `/api/configuration/${key}/${entity}` : `/api/configuration/${key}`;

export function useAppConfiguration<T>(key: string) {
  return useApi<T>(apiPath(key), {
    errorMessage: dataNotFoundMessage("App Configuration"),
  });
}

export function useEntityConfiguration<T>(key: string, entity: string) {
  return useApi<T>(apiPath(key, entity), {
    errorMessage: dataNotFoundMessage("Entity Configuration"),
  });
}

export function useUpsertConfigurationMutation(key: string, entity?: string) {
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
