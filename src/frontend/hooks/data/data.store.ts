import qs from "qs";
import { useRouter } from "next/router";
import { FieldQueryFilter, FilterOperators } from "shared/types/data";
import { CRUD_CONFIG_NOT_FOUND } from "frontend/lib/crud-config";
import { ApiRequest } from "frontend/lib/data/makeRequest";
import { useApi } from "frontend/lib/data/useApi";
import { useWaitForResponseMutationOptions } from "frontend/lib/data/useMutate/useWaitForResponseMutationOptions";
import { useApiQueries } from "frontend/lib/data/useApi/useApiQueries";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { DataStates } from "frontend/lib/data/types";
import { SYSTEM_LOADING_VALUE } from "frontend/lib/routing/constants";
import { typescriptSafeObjectDotEntries } from "shared/lib/objects";
import { useEntityCrudConfig } from "../entity/entity.config";
import { useMultipleEntityReferenceFields } from "../entity/entity.store";
import {
  DATA_MUTATION_ENDPOINTS_TO_CLEAR,
  ENTITY_COUNT_PATH,
  ENTITY_DETAILS_PATH,
  ENTITY_REFERENCE_PATH,
  SINGLE_DATA_MUTATION_ENDPOINTS_TO_CLEAR,
} from "./constants";
import { useEntityMetadataDetails } from "./portal";

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

  useEntityMetadataDetails({ entity, entityId, column });

  return useApi<Record<string, string>>(
    ENTITY_DETAILS_PATH({ entity, entityId, column }),
    {
      errorMessage: entityCrudConfig.TEXT_LANG.NOT_FOUND,
      enabled: column !== SYSTEM_LOADING_VALUE && !!entityId,
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

  const entitiesReferences = typescriptSafeObjectDotEntries(
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

export const useEntityDataReference = (entity: string, entityId: string) => {
  return useApi<string>(ENTITY_REFERENCE_PATH({ entity, entityId }), {
    errorMessage: CRUD_CONFIG_NOT_FOUND("Reference data"),
    enabled: !!entityId && !!entity,
    defaultData: "",
  });
};
export function useEntityDataCreationMutation(
  entity: string,
  option?: {
    hideSuccessMessage?: boolean;
    onSuccessActionWithFormData?: (id: string) => void;
  }
) {
  const entityCrudConfig = useEntityCrudConfig(entity);
  const router = useRouter();
  return useWaitForResponseMutationOptions<
    Record<string, string>,
    { id: string }
  >({
    mutationFn: async (data) =>
      await ApiRequest.POST(`/api/data/${entity}`, { data }),
    endpoints: DATA_MUTATION_ENDPOINTS_TO_CLEAR(entity),
    onSuccessActionWithFormData: ({ id }) => {
      option?.onSuccessActionWithFormData(id);
    },
    smartSuccessMessage: option?.hideSuccessMessage
      ? undefined
      : ({ id }) => ({
          description: entityCrudConfig.MUTATION_LANG.CREATE,
          action: {
            label: entityCrudConfig.MUTATION_LANG.VIEW_DETAILS,
            action: () =>
              router.push(NAVIGATION_LINKS.ENTITY.DETAILS(entity, id)),
          },
        }),
  });
}

export function useEntityDataUpdationMutation(
  entity: string,
  entityId: string
) {
  const entityCrudConfig = useEntityCrudConfig(entity);
  const metadata = useEntityMetadataDetails({ entity, entityId });

  return useWaitForResponseMutationOptions<Record<string, string>>({
    mutationFn: async (data) =>
      await ApiRequest.PATCH(`/api/data/${entity}/${entityId}`, {
        data: { ...data, ...metadata },
      }),
    endpoints: [
      ...SINGLE_DATA_MUTATION_ENDPOINTS_TO_CLEAR({ entity, entityId }),
      ...DATA_MUTATION_ENDPOINTS_TO_CLEAR(entity),
    ],
    successMessage: { description: entityCrudConfig.MUTATION_LANG.EDIT },
  });
}

export function useEntityDataDeletionMutation(
  {
    entity,
    entityId,
  }: {
    entityId: string;
    entity: string;
  },
  redirectTo?: string
) {
  const router = useRouter();
  const entityCrudConfig = useEntityCrudConfig(entity);

  // eyes on optimstic delete here
  return useWaitForResponseMutationOptions<string>({
    mutationFn: async (id) =>
      await ApiRequest.DELETE(`/api/data/${entity}/${id}`),
    endpoints: [
      ...SINGLE_DATA_MUTATION_ENDPOINTS_TO_CLEAR({ entity, entityId }),
      ...DATA_MUTATION_ENDPOINTS_TO_CLEAR(entity),
    ],
    onSuccessActionWithFormData: () => {
      if (redirectTo) {
        router.replace(redirectTo);
      }
    },
    successMessage: { description: entityCrudConfig.MUTATION_LANG.DELETE },
  });
}
