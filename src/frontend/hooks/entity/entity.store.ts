import { dataNotFoundMessage, useApi, useApiQueries } from "@hadmean/protozoa";
import { IEntityField, IEntityRelation } from "shared/types/db";
import { ILabelValue } from "types";
import { isRouterParamEnabled } from "..";
import { useEntityDictionPlurals } from "./entity.queries";

export const ENTITY_FIELDS_ENDPOINT = (entity: string) =>
  `/api/entities/${entity}/fields`;

export const ENTITY_RELATIONS_ENDPOINT = (entity: string) =>
  `/api/entities/${entity}/relations`;

export const ACTIVE_ENTITIES_ENDPOINT = "/api/entities/active";

export const useActiveEntities = () => {
  const menuItems = useApi<ILabelValue[]>(ACTIVE_ENTITIES_ENDPOINT, {
    errorMessage: dataNotFoundMessage("Entities menu items"),
  });

  const getEntitiesDictionPlurals = useEntityDictionPlurals(
    menuItems.data || [],
    "value"
  );

  return {
    ...menuItems,
    data: (menuItems.data || []).map(({ value }) => ({
      value,
      label: getEntitiesDictionPlurals(value),
    })),
  };
};

export const useEntitiesList = () =>
  useApi<ILabelValue[]>("/api/entities/list", {
    errorMessage: dataNotFoundMessage("Entities list"),
  });

export const useEntityFields = (entity: string) =>
  useApi<IEntityField[]>(ENTITY_FIELDS_ENDPOINT(entity), {
    errorMessage: dataNotFoundMessage("Entity Fields"),
    enabled: isRouterParamEnabled(entity),
  });

export const useEntityRelationsList = (entity: string) =>
  useApi<string[]>(`/api/entities/${entity}/relation-list`, {
    errorMessage: dataNotFoundMessage("Entity Relations List"),
    enabled: isRouterParamEnabled(entity),
  });

export const useEntityFieldLists = (entity: string) =>
  useApi<string[]>(ENTITY_FIELDS_ENDPOINT(entity), {
    errorMessage: dataNotFoundMessage("Entity Fields List"),
    enabled: isRouterParamEnabled(entity),
    selector: (data: IEntityField[]) => data.map(({ name }) => name),
  });

export const useEntityReferenceFields = (entity: string) =>
  useApi<IEntityRelation[]>(ENTITY_RELATIONS_ENDPOINT(entity), {
    errorMessage: dataNotFoundMessage("Entity Reference Fields"),
    enabled: isRouterParamEnabled(entity),
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
    errorMessage: dataNotFoundMessage("Entity Reference Fields"),
    enabled: isRouterParamEnabled(entity),
    selector: (input: IEntityRelation[]) => {
      return Object.fromEntries(
        input
          .filter(({ type }) => type === "toOne")
          .map(({ field, table }) => [field, table])
      );
    },
  });

export const useEntityIdField = (entity: string) =>
  useApi<string>(ENTITY_FIELDS_ENDPOINT(entity), {
    errorMessage: dataNotFoundMessage("Entity Id Field"),
    enabled: isRouterParamEnabled(entity),
    selector: (data: IEntityField[]) =>
      data.find(({ isId }) => isId)?.name || "id",
  });
