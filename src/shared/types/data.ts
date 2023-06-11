import { IPaginatedDataState, IColumnFilterBag } from "@hadmean/protozoa";

export type FieldQueryFilter = { id: string; value: IColumnFilterBag<unknown> };

export type QueryFilterSchema = {
  operator: "and" | "or";
  children: Array<FieldQueryFilter | QueryFilterSchema>;
};

export type ITableTab = {
  id: string;
  title: string;
  dataState: Pick<
    IPaginatedDataState<unknown>,
    "filters" | "sortBy" | "pageSize"
  >;
};

export const FOR_CODE_COV = 1;

export type DataCrudKeys = "create" | "update" | "table" | "details";
