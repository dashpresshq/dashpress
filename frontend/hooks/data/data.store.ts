import {
  dataNotFoundMessage,
  makeDeleteRequest,
  makePatchRequest,
  makePostRequest,
  MutationsLang,
  useApi,
  useApiQueries,
  SLUG_LOADING_VALUE,
  useWaitForResponseMutationOptions,
} from "@gothicgeeks/shared";
import qs from "qs";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { FilterOperators } from "@gothicgeeks/design-system";
import { QueryFilter } from "shared/types";
import { NAVIGATION_LINKS } from "../../lib/routing/links";
import { useEntityDiction } from "../entity/entity.config";
import { useMultipleEntityReferenceFields } from "../entity/entity.store";

export const ENTITY_TABLE_PATH = (entity: string) =>
  `/api/data/${entity}/table`;

export const ENTITY_COUNT_PATH = (entity: string) =>
  `/api/data/${entity}/count`;

export const ENTITY_DETAILS_PATH = (entity: string, id: string) =>
  `/api/data/${entity}/${id}`;

export const ENTITY_REFERENCE_PATH = (entity: string, id: string) =>
  `/api/data/${entity}/${id}/reference`;

export const ENTITY_LIST_PATH = (entity: string) => `/api/data/${entity}`;

export const useEntityDataDetails = (entity: string, id: string) => {
  const entityDiction = useEntityDiction();

  return useApi<Record<string, string>>(ENTITY_DETAILS_PATH(entity, id), {
    errorMessage: dataNotFoundMessage(entityDiction.singular),
    enabled: !!id && !!entity && id !== SLUG_LOADING_VALUE,
  });
};

export const useEntitiesCount = (entities: string[]) => {
  return useApiQueries<{ entity: string }, { count: number }>({
    input: entities.map((entity) => ({ entity })),
    accessor: "entity",
    pathFn: (entity) => ENTITY_COUNT_PATH(entity),
  });
};

export const useEntityReferenceCount = (
  entities: string[],
  reference: { entity: string; entityId: string }
) => {
  const multipleEntityReferenceFields =
    useMultipleEntityReferenceFields(entities);

  const entitiesReferences = Object.entries(
    multipleEntityReferenceFields.data || {}
  )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, requestResponse]) => !requestResponse.isLoading)
    .map(([entity, requestResponse]) => {
      const referenceField = requestResponse.data.find(
        ({ table }) => table === reference.entity
      )?.field;
      return {
        entity,
        referenceField,
      };
    });

  return useApiQueries<{ entity: string }, { count: number }>({
    input: entitiesReferences,
    accessor: "entity",
    pathFn: (entity) => {
      const queryFilter: QueryFilter = {
        id: entitiesReferences.find(
          (entityReference) => entity === entityReference.entity
        ).referenceField,
        value: {
          operator: FilterOperators.EQUAL_TO,
          value: reference.entityId,
        },
      };
      return `${ENTITY_COUNT_PATH(entity)}?${qs.stringify({
        filters: [queryFilter],
      })}`;
    },
  });
};

export const useEntityDataReference = (entity: string, id: string) =>
  useApi<string>(ENTITY_REFERENCE_PATH(entity, id), {
    errorMessage: dataNotFoundMessage("Reference data not found"),
    enabled: !!(id && entity),
  });

export function useEntityDataCreationMutation(entity: string) {
  const entityDiction = useEntityDiction();
  const router = useRouter();
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [
      ENTITY_TABLE_PATH(entity),
      ENTITY_COUNT_PATH(entity),
      ENTITY_LIST_PATH(entity),
    ],
    smartSuccessMessage: ({ id }) => ({
      message: MutationsLang.create(entityDiction.singular),
      action: {
        label: MutationsLang.viewDetails(entityDiction.singular),
        action: () => router.push(NAVIGATION_LINKS.ENTITY.DETAILS(entity, id)),
      },
    }),
  });

  return useMutation(
    async (data: Record<string, string>) =>
      await makePostRequest(`/api/data/${entity}`, { data }),
    apiMutateOptions
  );
}

export function useEntityDataUpdationMutation(entity: string, id: string) {
  const entityDiction = useEntityDiction();
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [
      ENTITY_TABLE_PATH(entity),
      ENTITY_DETAILS_PATH(entity, id),
      ENTITY_LIST_PATH(entity),
    ],
    successMessage: MutationsLang.edit(entityDiction.singular),
  });

  return useMutation(
    async (data: Record<string, string>) =>
      await makePatchRequest(`/api/data/${entity}/${id}`, { data }),
    apiMutateOptions
  );
}

export function useEntityDataDeletionMutation(
  entity: string,
  redirectTo?: string
) {
  const entityDiction = useEntityDiction();
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [
      ENTITY_TABLE_PATH(entity),
      ENTITY_COUNT_PATH(entity),
      ENTITY_LIST_PATH(entity),
    ],
    redirect: redirectTo,
    successMessage: MutationsLang.delete(entityDiction.singular),
  });

  return useMutation(
    async (id: string) => await makeDeleteRequest(`/api/data/${entity}/${id}`),
    apiMutateOptions
  );
}
