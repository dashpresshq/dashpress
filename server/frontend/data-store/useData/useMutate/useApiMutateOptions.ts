import noop from "lodash/noop";
import { useQueryClient } from "react-query";
import { PASS_DATA_FROM_HANDLER_ERROR_MESSAGE } from "./constants";
import { IApiMutateOptions } from "./types";
import { useApiMutate } from "./useApiMutate";
import { getQueryCachekey } from "../getQueryCacheKey";
import { ToastService } from "../../../lib/services/toast";

export function useApiMutateOptions<T, K>(options: IApiMutateOptions<T, K>) {
  const apiMutate = useApiMutate<T>(options.dataQueryPath);
  const queryClient = useQueryClient();

  return {
    onMutate: async (formData: K) => {
      return apiMutate.set((oldData) => options.onMutate(oldData, formData));
    },
    onSuccess: async (formData?: K) => {
      if (options.smartSuccessMessage) {
        if (formData === undefined) {
          throw new Error(PASS_DATA_FROM_HANDLER_ERROR_MESSAGE);
        }
        ToastService.success(options.smartSuccessMessage(formData));
      } else if (options.successMessage) {
        ToastService.success(options.successMessage);
      }
      if (options.otherEndpoints) {
        options.otherEndpoints.forEach((queryKey) => {
          queryClient.invalidateQueries(getQueryCachekey(queryKey));
        });
      }
      if (options.onSuccessActionWithFormData) {
        if (formData === undefined) {
          throw new Error(PASS_DATA_FROM_HANDLER_ERROR_MESSAGE);
        }
        options.onSuccessActionWithFormData(formData);
      }
    },
    onError: (error: unknown, formData: K, oldData: T | undefined) => {
      noop(formData, error);
      apiMutate.reset(oldData);
      ToastService.error(
        "Something went wrong. Please try again or contact support."
      );
    },
    onSettled: () => {
      if (options.isOnMockingMode) {
        return;
      }
      apiMutate.invalidate();
    },
  };
}
