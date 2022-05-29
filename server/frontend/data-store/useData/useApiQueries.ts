import { useMemo } from "react";
import { useQueries, UseQueryResult } from "react-query";
import { getQueryCachekey } from "./getQueryCacheKey";
import { makeGetRequest } from "./makeRequest";

export function useApiQueries<T, P>(
  input: T[],
  pathFn: (accessorValue: T[keyof T]) => string,
  accessor: keyof T,
  dataTransformer = (data: unknown): P => data as P
): Pick<
  UseQueryResult<Record<string, P>, unknown>,
  "data" | "error" | "isLoading"
> {
  const queryResults = useQueries(
    input.map((inputItem) => ({
      queryKey: getQueryCachekey(pathFn(inputItem[accessor])),
      queryFn: async () => {
        return dataTransformer(
          await makeGetRequest(pathFn(inputItem[accessor]))
        ) as P;
      },
    }))
  );

  const recordedData: Record<keyof T, P> = useMemo(() => {
    if (queryResults.some(({ isLoading }) => isLoading)) {
      return {};
    }
    return Object.fromEntries(
      input.map((_, index) => [
        input[index][accessor],
        queryResults[index].data,
      ])
    );
  }, [accessor, input, queryResults]);

  const findFirst = (key: keyof UseQueryResult) =>
    queryResults.find((queryResultsItem) => queryResultsItem[key])?.[key];

  return {
    error: findFirst("error"),
    isLoading: !!findFirst("isLoading"),
    data: recordedData,
  };
}
