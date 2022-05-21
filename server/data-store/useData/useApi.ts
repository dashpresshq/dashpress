import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { NotFoundError } from "./errors";
import { getQueryCachekey } from "./getQueryCacheKey";
import { IUseApiOptions } from "./types";
import { makeGetRequest } from "./makeRequest";

function buildApiOptions<T>(options: IUseApiOptions<T>) {
  return {
    enabled: options.enabled,
    select: (data: T) => {
      if (options.selector) {
        return options.selector(data);
      }
      return data;
    },
  };
}

export function useApi<T>(endPoint: string, options: IUseApiOptions<T> = {}) {
  const router = useRouter();
  return useQuery<T>(
    getQueryCachekey(endPoint),
    async () => {
      if (options.wipData) {
        return options.wipData;
      }
      try {
        return await makeGetRequest(endPoint, options.errorMessage);
      } catch (error) {
        if (options.returnUndefinedOnError) {
          return undefined;
        }
        if (error instanceof NotFoundError) {
          return router.replace("/404");
        }
        throw error;
      }
    },
    buildApiOptions(options)
  );
}
