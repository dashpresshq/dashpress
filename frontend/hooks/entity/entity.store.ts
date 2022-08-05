import { dataNotFoundMessage, useApi } from "@gothicgeeks/shared";
import { IEntityField, IEntityRelation } from "shared/types";
import { ILabelValue } from "../../../types";
import { useEntityDictionPlurals } from "./entity.queries";

export const ENTITY_FIELDS_ENDPOINT = (entity: string) =>
  `/api/entities/${entity}/fields`;

export const ENTITY_RELATIONS_ENDPOINT = (entity: string) =>
  `/api/entities/${entity}/relations`;

export const ENTITIES_MENU_ENDPOINT = "/api/entities/menu";

const isEntityEnabled = (entity: string): boolean =>
  !!entity && entity !== "loading";

export const useEntitiesMenuItems = () => {
  const menuItems = useApi<ILabelValue[]>(ENTITIES_MENU_ENDPOINT, {
    errorMessage: dataNotFoundMessage("Entities menu items"),
  });

  const entitiesDictionPlurals = useEntityDictionPlurals(
    menuItems.data || [],
    "value"
  );

  return {
    ...menuItems,
    data: (menuItems.data || []).map(({ value }) => ({
      value,
      label: entitiesDictionPlurals(value),
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
    enabled: isEntityEnabled(entity),
  });

export const useEntityRelationsList = (entity: string) =>
  useApi<string[]>(`/api/entities/${entity}/relation-list`, {
    errorMessage: dataNotFoundMessage("Entity Relations List"),
    enabled: isEntityEnabled(entity),
  });

export const useEntityFieldLists = (entity: string) =>
  useApi<string[]>(ENTITY_FIELDS_ENDPOINT(entity), {
    errorMessage: dataNotFoundMessage("Entity Fields List"),
    enabled: isEntityEnabled(entity),
    selector: (data: IEntityField[]) => data.map(({ name }) => name),
  });

export const useEntityReferenceFields = (entity: string) =>
  useApi<IEntityRelation[]>(ENTITY_RELATIONS_ENDPOINT(entity), {
    errorMessage: dataNotFoundMessage("Entity Reference Fields"),
    enabled: isEntityEnabled(entity),
  });

export const useEntityToOneReferenceFields = (entity: string) =>
  useApi<Record<string, string>>(ENTITY_RELATIONS_ENDPOINT(entity), {
    errorMessage: dataNotFoundMessage("Entity Reference Fields"),
    enabled: isEntityEnabled(entity),
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
    enabled: isEntityEnabled(entity),
    selector: (data: IEntityField[]) =>
      data.find(({ isId }) => isId)?.name || "id",
  });
