import {
  dataNotFoundMessage,
  makeDeleteRequest,
  makePatchRequest,
  makePostRequest,
  useApi,
  useWaitForResponseMutationOptions,
} from "@gothicgeeks/shared";
import { useMutation } from "react-query";
import { SLUG_LOADING_VALUE } from "../../lib/routing/constants";
import { NAVIGATION_LINKS } from "../../lib/routing/links";
import { useEntityDiction } from "../entity/entity.config";

export const ENTITY_TABLE_PATH = (entity: string) =>
  `/api/data/${entity}/table`;
export const ENTITY_DETAILS_PATH = (entity: string, id: string) =>
  `/api/data/${entity}/${id}`;

export const useEntityDataDetails = (entity: string, id: string) => {
  const entityDiction = useEntityDiction();

  return useApi<Record<string, string>>(ENTITY_DETAILS_PATH(entity, id), {
    errorMessage: dataNotFoundMessage(entityDiction.singular),
    enabled: id !== SLUG_LOADING_VALUE,
  });
};

export function useEntityDataCreationMutation(entity: string) {
  const entityDiction = useEntityDiction();
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [ENTITY_TABLE_PATH(entity)],
    successMessage: `${entityDiction.singular} created successfully`,
  });

  return useMutation(
    async (values: Record<string, string>) => {
      return await makePostRequest(`/api/data/${entity}`, values);
    },
    apiMutateOptions
  );
}

// TODO optimisitc updates here
export function useEntityDataUpdationMutation(entity: string, id: string) {
  const entityDiction = useEntityDiction();
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [ENTITY_TABLE_PATH(entity), ENTITY_DETAILS_PATH(entity, id)],
    successMessage: `${entityDiction.singular} updated successfully`,
  });

  return useMutation(async (values: Record<string, string>) => {
    return await makePatchRequest(`/api/data/${entity}/${id}`, values);
  }, apiMutateOptions);
}

export function useEntityDataDeletionMutation(entity: string) {
  const entityDiction = useEntityDiction();
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [ENTITY_TABLE_PATH(entity)],
    redirect: NAVIGATION_LINKS.ENTITY.TABLE(entity),
    successMessage: `${entityDiction.singular} deleted successfully`,
  });

  return useMutation(async (id: string) => {
    return await makeDeleteRequest(`/api/data/${entity}/${id}`);
  }, apiMutateOptions);
}
