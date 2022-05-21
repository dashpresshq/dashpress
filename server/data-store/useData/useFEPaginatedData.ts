import { useQuery, UseQueryResult } from "react-query";
import { makeGetRequest } from "./makeRequest";
import { getQueryCachekey } from "./getQueryCacheKey";
import { IFEPaginatedDataState, IUseApiOptions, PaginatedData } from "./types";
import { buildApiOptions } from "./_buildOptions";
import get from "lodash/get";

const DEFAULT_PAGE_SIZE = 10;

export function useFEPaginatedData<T>(
  endPoint: string,
  dataState: IFEPaginatedDataState<T>,
  options: IUseApiOptions<T[]> = {}
): UseQueryResult<PaginatedData<T>> {
  return useQuery<PaginatedData<T>>(
    getQueryCachekey(endPoint),
    async () => {
      if (options?.wipData) {
        return options.wipData;
      }
      return await makeGetRequest(endPoint, "Data could not be retrieved");
    },
    {
      ...buildApiOptions(options),
      select: (data) => {
        // This is casting is needed because react-query expects the input and output data to be of the same format :shrug
        let returnData: T[] = data as unknown as T[];
        const pageSize = dataState.pageSize || DEFAULT_PAGE_SIZE;
        if (dataState.filter) {
          const filter = Object.entries(dataState.filter);
          returnData = returnData.filter((datum) => {
            return filter.every(([filterField, filterValue]) => {
              if (Array.isArray(filterValue)) {
                return filterValue.includes(get(datum, filterField));
              }
              return get(datum, filterField) === filterValue;
            });
          });
        }
        if (dataState.searchFields && dataState.search) {
          const { searchFields, search } = dataState;
          returnData = returnData.filter((datum) => {
            return searchFields.some((searchField) => {
              return get(datum, searchField, "")
                .toLowerCase()
                .includes(search.toLowerCase());
            });
          });
        }
        if (dataState.order) {
          const { field, by } = dataState.order;
          returnData = returnData.sort((a, b) => {
            const value1 = get(by === "ASC" ? a : b, field);
            const value2 = get(by === "ASC" ? b : a, field);
            if (typeof value1 === "string") {
              return compareString(value1, value2);
            }
            if (typeof value1 === "number") {
              return compareNumbers(value1, value2);
            }
            // Dont order if unknown types
            return 0;
          });
        }
        const totalReturnData = returnData.length;
        return {
          pageIndex: dataState.page,
          pageSize,
          totalRecords: totalReturnData,
          data: returnData.slice(
            (dataState.page - 1) * pageSize,
            dataState.page * pageSize
          ),
        };
      },
    }
  );
}
const compareNumbers = (value1: number, value2: number) => value1 - value2;
const compareString = (value1: string, value2: string) => {
  return value1.localeCompare(value2);
};
