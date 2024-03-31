export type ToastMessageInput =
  | { message: string; action: { label: string; action: () => void } }
  | string;

export interface IApiMutateOptions<T, V, R> {
  dataQueryPath: string;
  otherEndpoints?: string[];
  onMutate: (oldData: T | undefined, form: V) => T;
  mutationFn: (form: V) => Promise<R>;
  successMessage?: ToastMessageInput;
  smartSuccessMessage?: (formData: R) => ToastMessageInput;
  onSuccessActionWithFormData?: (formData: R) => void;
}

export const FOR_CODE_COV = 1;
