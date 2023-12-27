import { IEntityField, IEntityRelation } from "shared/types/db";
import { ILabelValue } from "shared/types/options";
import { CRUD_CONFIG_NOT_FOUND } from "frontend/lib/crud-config";
import { DataStateKeys } from "frontend/lib/data/types";
import { useApi } from "frontend/lib/data/useApi";
import { useApiQueries } from "frontend/lib/data/useApi/useApiQueries";
import { useEntityDictionPlurals } from "./entity.queries";

export const ENTITY_FIELDS_ENDPOINT = (entity: string) =>
  `/api/entities/${entity}/fields`;

export const ENTITY_RELATIONS_ENDPOINT = (entity: string) =>
  `/api/entities/${entity}/relations`;

export const ACTIVE_ENTITIES_ENDPOINT = "/api/entities/active";

const useEntitiesListLabel = (entitiesList: DataStateKeys<ILabelValue[]>) => {
  const getEntitiesDictionPlurals = useEntityDictionPlurals(
    entitiesList.data,
    "value"
  );

  return {
    ...entitiesList,
    data: entitiesList.data.map(({ value }) => ({
      value,
      label: getEntitiesDictionPlurals(value),
    })),
  };
};

export const useActiveEntities = () => {
  const menuItems = useApi<ILabelValue[]>(ACTIVE_ENTITIES_ENDPOINT, {
    errorMessage: CRUD_CONFIG_NOT_FOUND("Active entities"),
    defaultData: [],
  });

  return useEntitiesListLabel(menuItems);
};

export const useEntityFields = (entity: string) =>
  useApi<IEntityField[]>(ENTITY_FIELDS_ENDPOINT(entity), {
    errorMessage: CRUD_CONFIG_NOT_FOUND("Entity Fields"),
    defaultData: [],
  });

export const useEntityRelationsList = (entity: string) =>
  useApi<string[]>(`/api/entities/${entity}/relation-list`, {
    errorMessage: CRUD_CONFIG_NOT_FOUND("Entity Relations List"),
    defaultData: [],
  });

export const useEntityFieldLists = (entity: string) =>
  useApi<string[]>(ENTITY_FIELDS_ENDPOINT(entity), {
    errorMessage: CRUD_CONFIG_NOT_FOUND("Entity Fields List"),
    selector: (data: IEntityField[]) => data.map(({ name }) => name),
    defaultData: [],
  });

export const useEntityReferenceFields = (entity: string) =>
  useApi<IEntityRelation[]>(ENTITY_RELATIONS_ENDPOINT(entity), {
    errorMessage: CRUD_CONFIG_NOT_FOUND("Entity Reference Fields"),
    defaultData: [],
  });

export const useMultipleEntityReferenceFields = (entities: string[]) => {
  return useApiQueries<{ entity: string }, IEntityRelation[]>({
    input: entities.map((entity) => ({ entity })),
    accessor: "entity",
    pathFn: (entity) => ENTITY_RELATIONS_ENDPOINT(entity),
  });
};

export const useEntityToOneReferenceFields = (entity: string) =>
  useApi<Record<string, string>>(ENTITY_RELATIONS_ENDPOINT(entity), {
    errorMessage: CRUD_CONFIG_NOT_FOUND("Entity Reference Fields"),
    selector: (input: IEntityRelation[]) => {
      return Object.fromEntries(
        input
          .filter(
            ({ type, inverseToOneField }) =>
              type === "toOne" && !inverseToOneField
          )
          .map(({ field, table }) => [field, table])
      );
    },
    defaultData: {},
  });

export const useEntityIdField = (entity: string) =>
  useApi<string>(ENTITY_FIELDS_ENDPOINT(entity), {
    defaultData: "",
    errorMessage: CRUD_CONFIG_NOT_FOUND("Entity Id Field"),
    selector: (data: IEntityField[]) =>
      data.find(({ isId }) => isId)?.name || "id",
  });
