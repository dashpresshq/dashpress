import {
  IBEPaginatedDataState,
  IFEPaginatedDataState,
} from "@hadmean/protozoa";

export function createFEPaginationOptions<T>(
  dataState: IFEPaginatedDataState<T> | IBEPaginatedDataState
): IFEPaginatedDataState<T> {
  return {
    ...dataState,
    sortBy: undefined,
    pageIndex: dataState.pageIndex + 1,
    filters: undefined,
  };
}

export const DEFAULT_FE_TABLE_PARAMS = {
  pageIndex: 0,
  pageSize: 10,
  hiddenColumns: [],
  filters: [],
  sortBy: [],
};
