import {
  dataNotFoundMessage,
  makeDeleteRequest,
  makePatchRequest,
  makePostRequest,
  useApi,
  useWaitForResponseMutationOptions,
} from '@gothicgeeks/shared';
import { useMutation } from 'react-query';
import { SLUG_LOADING_VALUE } from '../../lib/routing/constants';
import { NAVIGATION_LINKS } from '../../lib/routing/links';
import { useEntityDiction } from '../entity/entity.config';

export const ENTITY_TABLE_PATH = (entity: string) => `/api/data/${entity}/table`;
export const ENTITY_DETAILS_PATH = (entity: string, id: string) => `/api/data/${entity}/${id}`;
export const ENTITY_REFERENCE_PATH = (entity: string, id: string) => `/api/data/${entity}/${id}/reference`;

export const useEntityDataDetails = (entity: string, id: string) => {
  const entityDiction = useEntityDiction();

  return useApi<Record<string, string>>(ENTITY_DETAILS_PATH(entity, id), {
    errorMessage: dataNotFoundMessage(entityDiction.singular),
    enabled: !!id && !!entity && id !== SLUG_LOADING_VALUE,
  });
};

export const useEntityDataReference = (
  entity: string,
  id: string,
) => useApi<string>(ENTITY_REFERENCE_PATH(entity, id), {
  errorMessage: dataNotFoundMessage('Reference data not found'),
  enabled: !!(id && entity),
});

export function useEntityDataCreationMutation(entity: string) {
  const entityDiction = useEntityDiction();
  const apiMutateOptions = useWaitForResponseMutationOptions<Record<string, string>>({
    endpoints: [ENTITY_TABLE_PATH(entity)],
    successMessage: `${entityDiction.singular} created successfully`,
  });

  return useMutation(
    async (data: Record<string, string>) => await makePostRequest(`/api/data/${entity}`, { data }),
    apiMutateOptions,
  );
}

// TODO optimisitc updates here
export function useEntityDataUpdationMutation(entity: string, id: string) {
  const entityDiction = useEntityDiction();
  const apiMutateOptions = useWaitForResponseMutationOptions<Record<string, string>>({
    endpoints: [ENTITY_TABLE_PATH(entity), ENTITY_DETAILS_PATH(entity, id)],
    successMessage: `${entityDiction.singular} updated successfully`,
  });

  return useMutation(
    async (data: Record<string, string>) => await makePatchRequest(`/api/data/${entity}/${id}`, { data }),
    apiMutateOptions,
  );
}

export function useEntityDataDeletionMutation(entity: string) {
  const entityDiction = useEntityDiction();
  const apiMutateOptions = useWaitForResponseMutationOptions<Record<string, string>>({
    endpoints: [ENTITY_TABLE_PATH(entity)],
    redirect: NAVIGATION_LINKS.ENTITY.TABLE(entity),
    successMessage: `${entityDiction.singular} deleted successfully`,
  });

  return useMutation(
    async (id: string) => await makeDeleteRequest(`/api/data/${entity}/${id}`),
    apiMutateOptions,
  );
}
