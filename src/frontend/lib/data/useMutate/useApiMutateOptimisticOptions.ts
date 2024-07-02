import { noop } from "shared/lib/noop";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { msg } from "@lingui/macro";
import { IApiMutateOptions } from "./types";
import { getQueryCachekey } from "../constants/getQueryCacheKey";
import { useToast } from "@/components/app/toast/use-toast";
import { fakeMessageDescriptor } from "@/translations/fake";

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
  const { toast } = useToast();

  return useMutation({
    mutationFn: options.mutationFn,
    onMutate: async (formData: V) =>
      apiMutate.set((oldData) => options.onMutate(oldData, formData)),
    onSuccess: async (requestResponse: R) => {
      if (options.smartSuccessMessage) {
        toast({
          variant: "green",
          ...options.smartSuccessMessage(requestResponse),
        });
      } else if (options.successMessage) {
        toast({ variant: "green", ...options.successMessage });
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
      toast({
        variant: "red",
        title: msg`Request Failed`,
        description: fakeMessageDescriptor(
          error.message ||
            "Something went wrong. Please try again or contact your adminstrator."
        ),
      });
    },
    onSettled: () => {
      apiMutate.invalidate();
    },
  });
}
