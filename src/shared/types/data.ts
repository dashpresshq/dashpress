import { IColumnFilterBag } from "@hadmean/chromista";
import { IBEPaginatedDataState } from "@hadmean/protozoa";

export type QueryFilter = { id: string; value: IColumnFilterBag<unknown> };

export type ITableTab = {
  id: string;
  title: string;
  dataState: Pick<IBEPaginatedDataState, "filters" | "sortBy" | "pageSize">;
};

export const FOR_CODE_COV = 1;
