import { dataNotFoundMessage, useApi } from "@gothicgeeks/shared";
import { IJsonSchemaModel } from "../../backend/schema/types";
import { ILabelValue } from "../../types";
import { INavigationItem } from "../_layouts/types";

export const useSchemaMenuItems = () => {
  return useApi<INavigationItem[]>("/api/schema/menu", {
    errorMessage: dataNotFoundMessage("Menu items"),
    selector: (input: ILabelValue[]) =>
      input.map(({ label, value }) => ({ title: label, link: `/admin/${value}` })),
  });
};

export const useSchemaList = () => {
  return useApi<ILabelValue[]>("/api/schema/list", {
    errorMessage: dataNotFoundMessage("Schema list"),
  });
};

export const useSchemaFields = (model: string) => {
  return useApi<IJsonSchemaModel[]>(`/api/schema/${model}/fields`, {
    errorMessage: dataNotFoundMessage("Schema Fields"),
    enabled: model !== "loading"
  });
};
