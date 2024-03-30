import { useQueryClient } from "@tanstack/react-query";
import { getQueryCachekey } from "../constants/getQueryCacheKey";

export function useApiMutate<T>(endpoint: string) {
  const queryClient = useQueryClient();
  const queryKey = getQueryCachekey(endpoint);

  return {
    set: async (mutateOldData: (oldData: T | undefined) => T) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<T>(queryKey);
      queryClient.setQueryData<T>(queryKey, mutateOldData);
      return previousData;
    },
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    reset: (previousData: T | undefined) => {
      queryClient.setQueryData(queryKey, previousData);
    },
  };
}
