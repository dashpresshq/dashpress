import { useQuery } from "@tanstack/react-query";
import { AppStorage } from "frontend/lib/storage/app";
import { useRouter } from "next/router";
import { useLingui } from "@lingui/react";
import { IUseApiOptions } from "../types";
import { ApiRequest } from "../makeRequest";
import { buildApiOptions } from "../_buildOptions";
import { getQueryCachekey } from "../constants/getQueryCacheKey";

export function useApi<T>(endPoint: string, options: IUseApiOptions<T>) {
  const builtOptions = buildApiOptions(options);
  const router = useRouter();
  const { _ } = useLingui();
  const { data = options.defaultData, ...rest } = useQuery<T>({
    enabled: router.isReady && builtOptions.enabled,
    queryKey: getQueryCachekey(endPoint),
    queryFn: async () => {
      try {
        if (options.request) {
          return await ApiRequest.ACTION(
            options.request.method,
            endPoint,
            options.request.body,
            { errorMessage: _(options.errorMessage) }
          );
        }
        return await ApiRequest.GET(endPoint, _(options.errorMessage));
      } catch (error) {
        if (options.returnUndefinedOnError) {
          return undefined;
        }
        throw error;
      }
    },
    ...builtOptions,
  });
  return { data, ...rest };
}

export function useStorageApi<T>(endPoint: string, options: IUseApiOptions<T>) {
  return useApi<T>(endPoint, {
    ...options,
    selector: (response) => {
      // TODO use indexDb
      const data = options.selector ? options.selector(response) : response;
      AppStorage.set(endPoint, response);
      return data;
    },
    placeholderData: AppStorage.get(endPoint),
  });
}
