import { useQuery, UseQueryResult } from "react-query";
import { makeGetRequest } from "./makeRequest";
import { getPaginatedDataCachekey } from "./getQueryCacheKey";
import { IBEPaginatedDataState, IUseApiOptions, PaginatedData } from "./types";
import { buildApiOptions } from "./_buildOptions";

export function usePaginatedData<T>(
  endPoint: string,
  dataState: IBEPaginatedDataState,
  options: IUseApiOptions<PaginatedData<T>> = {}
): UseQueryResult<PaginatedData<T>> {
  return useQuery<PaginatedData<T>>(
    getPaginatedDataCachekey(endPoint, dataState),
    async () => {
      if (options?.wipData) {
        return options.wipData;
      }
      return await makeGetRequest(
        endPoint + dataStateToQueryString(dataState),
        "Data could not be retrieved"
      );
    },
    { ...buildApiOptions(options), keepPreviousData: true }
  );
}
