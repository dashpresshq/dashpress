import { dataNotFoundMessage, useApi } from "@gothicgeeks/shared";
import {
  filterScalarEntity,
  getEntityReferencesMap,
} from "shared/entity.logic";
import { IEntityField } from "../../../backend/entities/types";
import { ILabelValue } from "../../../types";
import { useEntityDictionPlurals } from "./entity.queries";

export const ENTITY_FIELDS_ENDPOINT = (entity: string) =>
  `/api/entities/${entity}/fields`;

export const ENTITIES_MENU_ENDPOINT = "/api/entities/menu";

const entityEnabled = (entity: string): boolean =>
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
    enabled: entityEnabled(entity),
  });

export const useEntityScalarFields = (entity: string) =>
  useApi<IEntityField[]>(ENTITY_FIELDS_ENDPOINT(entity), {
    errorMessage: dataNotFoundMessage("Entity Scalar Fields"),
    enabled: entityEnabled(entity),
    selector: (data: IEntityField[]) => data.filter(filterScalarEntity),
  });

export const useEntityReferenceFields = (entity: string) =>
  useApi<Record<string, string>>(ENTITY_FIELDS_ENDPOINT(entity), {
    errorMessage: dataNotFoundMessage("Entity Reference Fields"),
    enabled: entityEnabled(entity),
    selector: (data: IEntityField[]) => getEntityReferencesMap(data),
  });

export const useEntityIdField = (entity: string) =>
  useApi<string>(ENTITY_FIELDS_ENDPOINT(entity), {
    errorMessage: dataNotFoundMessage("Entity Scalar Fields"),
    enabled: entityEnabled(entity),
    selector: (data: IEntityField[]) =>
      data.find(({ isId }) => isId)?.name || "id",
    // TODO validate data to have an id
  });
