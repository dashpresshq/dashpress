import { IColumnFilterBag } from "@hadmean/chromista";

export type QueryFilter = { id: string; value: IColumnFilterBag<unknown> };

export type ITableTab = {
  title: string;
  sortBy: string;
  orderBy: "desc" | "asc";
  filters: QueryFilter[];
};
