import { useQuery, UseQueryResult } from "react-query";
import get from "lodash/get";
import {
  FilterOperators,
  makeGetRequest,
  getQueryCachekey,
  IUseApiOptions,
  PaginatedData,
  IPaginatedDataState,
} from "@hadmean/protozoa";
import { QueryFilter } from "shared/types/data";

const DEFAULT_PAGE_SIZE = 10;

const compareNumbers = (value1: number, value2: number) => value1 - value2;
const compareString = (value1: string, value2: string) =>
  value1.localeCompare(value2);

export function useFEPaginatedData<T>(
  endPoint: string,
  dataState: IPaginatedDataState<T>,
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
      enabled: options.enabled,
      select: (data: any) => {
        let returnData: T[] = data as unknown as T[];
        const pageSize = dataState.pageSize || DEFAULT_PAGE_SIZE;
        if (dataState.filters) {
          returnData = returnData.filter((datum) => {
            return Object.values(dataState.filters || {}).every(($filter) => {
              const filter = $filter as unknown as QueryFilter;
              const filterValue = filter.value.value;
              const currentValue = get(datum, filter.id);
              switch (filter.value.operator) {
                case FilterOperators.CONTAINS:
                  return currentValue
                    .toLowerCase()
                    .includes(((filterValue || "") as string).toLowerCase());
                case FilterOperators.EQUAL_TO:
                  return currentValue === filterValue;
                case FilterOperators.NOT_EQUAL:
                  return currentValue !== filterValue;
                case FilterOperators.LESS_THAN:
                  return currentValue < filterValue;
                case FilterOperators.GREATER_THAN:
                  return currentValue > filterValue;
              }
              return true;
            });
          });
        }

        if (dataState.sortBy && dataState.sortBy.length > 0) {
          const { id, desc } = dataState.sortBy[0];
          returnData = returnData.sort((a, b) => {
            const value1 = get(desc ? b : a, id);
            const value2 = get(desc ? a : b, id);
            if (typeof value1 === "string") {
              return compareString(value1, value2);
            }
            if (typeof value1 === "number") {
              return compareNumbers(value1, value2);
            }
            return 0;
          });
        }
        const totalReturnData = returnData.length;
        return {
          pageIndex: dataState.pageIndex,
          pageSize,
          totalRecords: totalReturnData,
          data: returnData.slice(
            (dataState.pageIndex - 1) * pageSize,
            dataState.pageIndex * pageSize
          ),
        };
      },
    }
  );
}
