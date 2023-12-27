import { useQueries, UseQueryResult } from "react-query";
import { useRouter } from "next/router";
import { makeGetRequest } from "../makeRequest";
import { getQueryCachekey } from "../constants/getQueryCacheKey";

interface IApiQueriesOptions<T, P> {
  input: T[];
  pathFn: (accessorValue: T[keyof T]) => string;
  accessor: keyof T;
  dataTransformer?: (data: unknown, accessorValue?: T[keyof T]) => P;
  placeholderDataFn?: (accessor: T[keyof T]) => P;
}

export function useApiQueries<T, P>({
  input,
  pathFn,
  accessor,
  dataTransformer = (data: unknown): P => data as P,
  placeholderDataFn,
}: IApiQueriesOptions<T, P>): Pick<
  UseQueryResult<Record<string, UseQueryResult<P, unknown>>, unknown>,
  "data" | "error" | "isLoading"
> {
  const router = useRouter();

  const queryResults = useQueries(
    input.map((inputItem) => ({
      placeholderData: placeholderDataFn
        ? placeholderDataFn(inputItem[accessor])
        : undefined,
      enabled: router.isReady,
      queryKey: getQueryCachekey(pathFn(inputItem[accessor])),
      queryFn: async () =>
        dataTransformer(
          await makeGetRequest(pathFn(inputItem[accessor])),
          inputItem[accessor]
        ) as P,
    }))
  );

  const recordedData = (): Record<keyof T, UseQueryResult<P, unknown>> =>
    Object.fromEntries(
      input.map((_, index) => [input[index][accessor], queryResults[index]])
    );

  const findFirst = (key: keyof UseQueryResult) =>
    queryResults.find((queryResultsItem) => queryResultsItem[key])?.[key];

  return {
    error: findFirst("error"),
    isLoading: !!findFirst("isLoading"),
    data: recordedData(),
  };
}
