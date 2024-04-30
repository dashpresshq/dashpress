import { noop } from "shared/lib/noop";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastService } from "frontend/lib/toast";
import { IApiMutateOptions } from "./types";
import { getQueryCachekey } from "../constants/getQueryCacheKey";

function useApiMutate<T>(endpoint: string) {
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

export function useApiMutateOptimisticOptions<T, V, R = void>(
  options: IApiMutateOptions<T, V, R>
) {
  const apiMutate = useApiMutate<T>(options.dataQueryPath);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: options.mutationFn,
    onMutate: async (formData: V) =>
      apiMutate.set((oldData) => options.onMutate(oldData, formData)),
    onSuccess: async (requestResponse: R) => {
      if (options.smartSuccessMessage) {
        ToastService.success(options.smartSuccessMessage(requestResponse));
      } else if (options.successMessage) {
        ToastService.success(options.successMessage);
      }
      if (options.otherEndpoints) {
        options.otherEndpoints.forEach((queryKey) => {
          queryClient.invalidateQueries({
            queryKey: getQueryCachekey(queryKey),
          });
        });
      }
      if (options.onSuccessActionWithFormData) {
        options.onSuccessActionWithFormData(requestResponse);
      }
    },
    onError: (
      error: { message: string },
      formData: V,
      oldData: T | undefined
    ) => {
      noop(formData, error);
      apiMutate.reset(oldData);
      ToastService.error(
        error.message ||
          "Something went wrong. Please try again or contact support."
      );
    },
    onSettled: () => {
      apiMutate.invalidate();
    },
  });
}
