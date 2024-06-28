import { MessageDescriptor } from "@lingui/core";

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
