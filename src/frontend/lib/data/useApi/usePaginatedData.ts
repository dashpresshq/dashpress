import { useQuery, UseQueryResult } from "react-query";
import qs from "qs";
import { IPaginatedDataState, PaginatedData } from "shared/types/data";
import { makeGetRequest } from "../makeRequest";
import { buildApiOptions } from "../_buildOptions";
import { IUseApiOptions } from "../types";
import { getPaginatedDataCachekey } from "../constants/getQueryCacheKey";

export const tableDataParamsToQueryString = (
  dataState: IPaginatedDataState<unknown>
): string => {
  const sortBy = dataState?.sortBy?.[0]?.id;
  const orderBy = dataState?.sortBy?.[0]?.desc ? "desc" : "asc";

  return `?${qs.stringify({
    page: dataState.pageIndex + 1,
    take: dataState.pageSize,
    orderBy,
    sortBy,
    filters: dataState.filters,
  })}`;
};

export function usePaginatedData<T extends Record<string, unknown>>(
  endPoint: string,
  dataState: IPaginatedDataState<T>,
  options: IUseApiOptions<PaginatedData<T>>
): UseQueryResult<PaginatedData<T>> {
  return useQuery<PaginatedData<T>>(
    getPaginatedDataCachekey(endPoint, dataState),
    async () => {
      return await makeGetRequest(
        endPoint + tableDataParamsToQueryString(dataState),
        "Data could not be retrieved"
      );
    },
    { ...buildApiOptions(options), keepPreviousData: true }
  );
}
