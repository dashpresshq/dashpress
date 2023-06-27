import { IPaginatedDataState } from "shared/types/data";

export const DEFAULT_TABLE_STATE: Required<IPaginatedDataState<unknown>> = {
  pageIndex: 0,
  pageSize: 10,
  filters: [],
  sortBy: [],
};
