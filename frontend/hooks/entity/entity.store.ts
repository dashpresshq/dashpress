import { dataNotFoundMessage, useApi } from "@gothicgeeks/shared";
import { filterScalarEntity } from "shared/entity.logic";
import { IEntityField } from "../../../backend/entities/types";
import { ILabelValue } from "../../../types";
import { useEntityDictionPlurals } from "./entity.queries";

export const ENTITY_FIELDS_ENDPOINT = (entity: string) =>
  `/api/entities/${entity}/fields`;

export const ENTITIES_MENU_ENDPOINT = "/api/entities/menu";

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

export const useEntitiesList = () => {
  return useApi<ILabelValue[]>("/api/entities/list", {
    errorMessage: dataNotFoundMessage("Entities list"),
  });
};

export const useEntityFields = (entity: string) => {
  return useApi<IEntityField[]>(ENTITY_FIELDS_ENDPOINT(entity), {
    errorMessage: dataNotFoundMessage("Entity Fields"),
    enabled: entity !== "loading",
  });
};

export const useEntityScalarFields = (entity: string) => {
  return useApi<IEntityField[]>(ENTITY_FIELDS_ENDPOINT(entity), {
    errorMessage: dataNotFoundMessage("Entity Scalar Fields"),
    enabled: entity !== "loading",
    selector: (data: IEntityField[]) => {
      return data.filter(filterScalarEntity);
    },
  });
};

export const useEntityIdField = (entity: string) => {
  return useApi<string>(ENTITY_FIELDS_ENDPOINT(entity), {
    errorMessage: dataNotFoundMessage("Entity Scalar Fields"),
    enabled: entity !== "loading",
    selector: (data: IEntityField[]) => {
      // TODO validate data to have an id
      return data.find(({ isId }) => isId)?.name || "id";
    },
  });
};
