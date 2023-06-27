import { useQuery, UseQueryResult } from "react-query";
import { IPaginatedDataState, PaginatedData } from "shared/types/data";
import { makeGetRequest } from "../makeRequest";
import { buildApiOptions } from "../_buildOptions";
import { IUseApiOptions } from "../types";
import { getPaginatedDataCachekey } from "../constants/getQueryCacheKey";
import { tableDataParamsToQueryString } from "./tableDataParamsToQueryString";

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
