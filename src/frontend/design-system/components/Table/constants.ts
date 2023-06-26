import { IPaginatedDataState } from "@hadmean/protozoa";

export const DEFAULT_TABLE_STATE: Required<IPaginatedDataState<unknown>> = {
  pageIndex: 0,
  pageSize: 10,
  filters: [],
  sortBy: [],
};
