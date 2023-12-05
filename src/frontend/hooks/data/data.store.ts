import qs from "qs";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { FieldQueryFilter, FilterOperators } from "shared/types/data";
import { CRUD_CONFIG_NOT_FOUND } from "frontend/lib/crud-config";
import { makeActionRequest } from "frontend/lib/data/makeRequest";
import { useApi } from "frontend/lib/data/useApi";
import { useWaitForResponseMutationOptions } from "frontend/lib/data/useMutate/useWaitForResponseMutationOptions";
import { SLUG_LOADING_VALUE } from "frontend/lib/routing/constants";
import { useApiQueries } from "frontend/lib/data/useApi/useApiQueries";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { DataStates } from "frontend/lib/data/types";
import { useEntityCrudConfig } from "../entity/entity.config";
import { useMultipleEntityReferenceFields } from "../entity/entity.store";
import { isRouterParamEnabled } from "..";
import { DATA_MUTATION_QUERY_ENDPOINTS } from "./portal";
import {
  CREATE_DATA_ENDPOINT_TO_CLEAR,
  ENTITY_COUNT_PATH,
  ENTITY_DETAILS_PATH,
  ENTITY_LIST_PATH,
  ENTITY_REFERENCE_PATH,
  ENTITY_TABLE_PATH,
} from "./constants";

export const useEntityDataDetails = ({
  entity,
  entityId,
  column,
}: {
  entity: string;
  entityId: string;
  column?: string;
}) => {
  const entityCrudConfig = useEntityCrudConfig(entity);

  return useApi<Record<string, string>>(
    ENTITY_DETAILS_PATH(entity, entityId, column),
    {
      errorMessage: entityCrudConfig.TEXT_LANG.NOT_FOUND,
      enabled:
        isRouterParamEnabled(entity) &&
        isRouterParamEnabled(entityId) &&
        column !== SLUG_LOADING_VALUE,
      defaultData: {},
    }
  );
};

const buildFilterCountQueryString = (
  entity: string,
  queryFilter: FieldQueryFilter[]
) =>
  `${ENTITY_COUNT_PATH(entity)}?${qs.stringify({
    filters: queryFilter,
  })}`;

export const useEntityFilterCount = (
  entity: string,
  filters: FieldQueryFilter[] | DataStates.Loading
) => {
  return useApi<{ count: number }>(
    buildFilterCountQueryString(
      entity,
      filters === DataStates.Loading ? [] : filters
    ),
    {
      errorMessage: CRUD_CONFIG_NOT_FOUND(`${entity} count`),
      enabled: filters !== DataStates.Loading,
      defaultData: { count: 0 },
    }
  );
};

export const useEntitiesFilterCount = (
  entityFilters: { entity: string; filters: FieldQueryFilter[]; id: string }[]
) => {
  const filterHashMap = Object.fromEntries(
    entityFilters.map(({ id, ...rest }) => [id, rest])
  );

  return useApiQueries<{ id: string }, { count: number }>({
    input: entityFilters,
    accessor: "id",
    pathFn: (id) => {
      const { entity, filters } = filterHashMap[id];
      return buildFilterCountQueryString(entity, filters);
    },
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
      const queryFilter: FieldQueryFilter = {
        id: entitiesReferences.find(
          (entityReference) => entity === entityReference.entity
        ).referenceField,
        value: {
          operator: FilterOperators.EQUAL_TO,
          value: reference.entityId,
        },
      };
      return buildFilterCountQueryString(entity, [queryFilter]);
    },
  });
};

export const useEntityDataReference = (entity: string, id: string) => {
  return useApi<string>(ENTITY_REFERENCE_PATH(entity, id), {
    errorMessage: CRUD_CONFIG_NOT_FOUND("Reference data"),
    enabled: isRouterParamEnabled(id) && isRouterParamEnabled(entity),
    defaultData: "",
  });
};
export function useEntityDataCreationMutation(entity: string) {
  const entityCrudConfig = useEntityCrudConfig();
  const router = useRouter();
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: CREATE_DATA_ENDPOINT_TO_CLEAR(entity),
    smartSuccessMessage: ({ id }) => ({
      message: entityCrudConfig.MUTATION_LANG.CREATE,
      action: {
        label: entityCrudConfig.MUTATION_LANG.VIEW_DETAILS,
        action: () => router.push(NAVIGATION_LINKS.ENTITY.DETAILS(entity, id)),
      },
    }),
  });

  return useMutation(
    async (data: Record<string, string>) =>
      await makeActionRequest("POST", `/api/data/${entity}`, { data }),
    apiMutateOptions
  );
}

export function useEntityDataUpdationMutation(entity: string, id: string) {
  const entityCrudConfig = useEntityCrudConfig();
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [
      ENTITY_TABLE_PATH(entity),
      ENTITY_DETAILS_PATH(entity, id),
      ENTITY_LIST_PATH(entity),
      ...DATA_MUTATION_QUERY_ENDPOINTS(entity),
    ],
    successMessage: entityCrudConfig.MUTATION_LANG.EDIT,
  });

  return useMutation(
    async (data: Record<string, string>) =>
      await makeActionRequest("PATCH", `/api/data/${entity}/${id}`, { data }),
    apiMutateOptions
  );
}

export function useEntityDataDeletionMutation(
  entity: string,
  redirectTo?: string
) {
  const router = useRouter();
  const entityCrudConfig = useEntityCrudConfig();
  const apiMutateOptions = useWaitForResponseMutationOptions<
    Record<string, string>
  >({
    endpoints: [
      ENTITY_TABLE_PATH(entity),
      ENTITY_COUNT_PATH(entity),
      ENTITY_LIST_PATH(entity),
      ...DATA_MUTATION_QUERY_ENDPOINTS(entity),
    ],
    onSuccessActionWithFormData: () => {
      if (redirectTo) {
        router.replace(redirectTo);
      }
    },
    successMessage: entityCrudConfig.MUTATION_LANG.DELETE,
  });
  // eyes on optimstic delete here
  return useMutation(
    async (id: string) =>
      await makeActionRequest("DELETE", `/api/data/${entity}/${id}`),
    apiMutateOptions
  );
}
