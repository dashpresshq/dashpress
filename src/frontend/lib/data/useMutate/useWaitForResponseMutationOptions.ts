import { useMutation, useQueryClient } from "@tanstack/react-query";
import { msg } from "@lingui/macro";
import { useToast } from "@/components/app/toast/use-toast";
import { fakeMessageDescriptor } from "@/translations/fake";
import { getQueryCachekey } from "../constants/getQueryCacheKey";
import type { ToastMessageInput } from "./types";

export interface IWaitForResponseMutationOptions<V, R> {
  endpoints: string[];
  redirect?: string;
  mutationFn: (formData: V) => Promise<R>;
  onSuccessActionWithFormData?: (response: R) => void;
  successMessage?: ToastMessageInput;
  smartSuccessMessage?: (formData: R) => ToastMessageInput;
}

const PASS_DATA_FROM_HANDLER_ERROR_MESSAGE =
  "Please return in the mutation what data you want to pass to the success handlers";

export function useWaitForResponseMutationOptions<V, R = void>(
  options: IWaitForResponseMutationOptions<V, R>
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: options.mutationFn,
    onSuccess: async (formData: R | undefined) => {
      options.endpoints.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey: getQueryCachekey(queryKey) });
      });

      if (options.smartSuccessMessage) {
        if (formData === undefined) {
          throw new Error(PASS_DATA_FROM_HANDLER_ERROR_MESSAGE);
        }
        toast({ variant: "green", ...options.smartSuccessMessage(formData) });
      } else if (options.successMessage) {
        toast({ variant: "green", ...options.successMessage });
      }

      if (options.onSuccessActionWithFormData) {
        if (formData === undefined) {
          throw new Error(PASS_DATA_FROM_HANDLER_ERROR_MESSAGE);
        }
        options.onSuccessActionWithFormData(formData);
      }
    },
    onError: (error: { message: string }) => {
      toast({
        variant: "red",
        title: msg`Request Failed`,
        description: fakeMessageDescriptor(
          error.message ||
            "Something went wrong. Please try again or contact your adminstrator."
        ),
      });
    },
  });
}
