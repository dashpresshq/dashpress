import { useQueries, UseQueryResult } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ApiRequest } from "../makeRequest";
import { getQueryCachekey } from "../constants/getQueryCacheKey";

interface IApiQueriesOptions<T, P> {
  input: T[];
  pathFn: (accessorValue: T[keyof T]) => string;
  accessor: keyof T;
  dataTransformer?: (data: unknown, accessorValue?: T[keyof T]) => P;
  persist?: boolean;
}

export function useApiQueries<T, P>({
  input,
  pathFn,
  persist,
  accessor,
  dataTransformer = (data: unknown): P => data as P,
}: IApiQueriesOptions<T, P>): Pick<
  UseQueryResult<Record<string, UseQueryResult<P, unknown>>, unknown>,
  "data" | "error" | "isLoading"
> {
  const router = useRouter();

  const queryResults = useQueries({
    queries: input.map((inputItem) => ({
      enabled: router.isReady,
      queryKey: getQueryCachekey(pathFn(inputItem[accessor])),
      meta: {
        persist,
      },
      queryFn: async ({ signal }) =>
        dataTransformer(
          await ApiRequest.GET(pathFn(inputItem[accessor]), signal)
        ) as P,
    })),
  });

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
