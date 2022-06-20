import { dataNotFoundMessage, useApi } from "@gothicgeeks/shared";
import { IEntityField } from "../../../backend/entities/types";
import { ILabelValue } from "../../../types";
import { INavigationItem } from "../../_layouts/types";

const ENTITY_FIELDS_ENDPOINT = (entity: string) => `/api/entities/${entity}/fields`;

export const useEntitiesMenuItems = () => {
  return useApi<INavigationItem[]>("/api/entities/menu", {
    errorMessage: dataNotFoundMessage("Entities menu items"),
    selector: (input: ILabelValue[]) =>
      input.map(({ label, value }) => ({
        title: label,
        link: `/admin/${value}`,
      })),
  });
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
      return data.filter(({ kind }) => kind === "scalar" || kind === 'enum');
    },
  });
};

export const useEntityIdField = (entity: string) => {
  return useApi<string>(ENTITY_FIELDS_ENDPOINT(entity), {
    errorMessage: dataNotFoundMessage("Entity Scalar Fields"),
    enabled: entity !== "loading",
    selector: (data: IEntityField[]) => {
      // TODO validate data to have an id
      return data.find(({ isId}) => isId)?.name || "id";
    },
  });
};
