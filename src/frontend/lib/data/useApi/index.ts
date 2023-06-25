import { useQuery } from "react-query";
import { AppStorage } from "frontend/lib/storage/app";
import { IUseApiOptions } from "../types";
import { makeActionRequest, makeGetRequest } from "../makeRequest";
import { buildApiOptions } from "../_buildOptions";
import { getQueryCachekey } from "../constants/getQueryCacheKey";

export function useApi<T>(endPoint: string, options: IUseApiOptions<T>) {
  const { data = options.defaultData, ...rest } = useQuery<T>(
    getQueryCachekey(endPoint),
    async () => {
      try {
        if (options.request) {
          return await makeActionRequest(
            options.request.method,
            endPoint,
            options.request.body,
            { errorMessage: options.errorMessage }
          );
        }
        return await makeGetRequest(endPoint, options.errorMessage);
      } catch (error) {
        if (options.returnUndefinedOnError) {
          return undefined;
        }
        throw error;
      }
    },
    buildApiOptions(options)
  );
  return { data, ...rest };
}

export function useStorageApi<T>(endPoint: string, options: IUseApiOptions<T>) {
  return useApi<T>(endPoint, {
    ...options,
    selector: (response) => {
      const data = options.selector ? options.selector(response) : response;
      AppStorage.set(endPoint, response);
      return data;
    },
    placeholderData: AppStorage.get(endPoint),
  });
}
