import { IPaginatedDataState, IColumnFilterBag } from "@hadmean/protozoa";

export type QueryFilter = { id: string; value: IColumnFilterBag<unknown> };

export type ITableTab = {
  id: string;
  title: string;
  dataState: Pick<
    IPaginatedDataState<unknown>,
    "filters" | "sortBy" | "pageSize"
  >;
};

export const FOR_CODE_COV = 1;
