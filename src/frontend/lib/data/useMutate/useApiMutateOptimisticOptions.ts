import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/macro";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/components/app/toast/use-toast";
import { noop } from "@/shared/lib/noop";
import { fakeMessageDescriptor } from "@/translations/fake";

import { getQueryCachekey } from "../constants/getQueryCacheKey";

export type ToastMessageInput = {
  description: MessageDescriptor;
  // action?: { label: MessageDescriptor; action: () => void };
};

export interface IApiMutateOptions<T, V, R> {
  dataQueryPath: string;
  otherEndpoints?: string[];
  onMutate: (oldData: T | undefined, form: V) => T;
  mutationFn: (form: V) => Promise<R>;
  successMessage?: ToastMessageInput;
  smartSuccessMessage?: (formData: R) => ToastMessageInput;
  onSuccessActionWithFormData?: (formData: R) => void;
}

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
