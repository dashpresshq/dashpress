export type ToastMessageInput =
  | { message: string; action: { label: string; action: () => void } }
  | string;

export interface IApiMutateOptions<T, K, V> {
  dataQueryPath: string;
  otherEndpoints?: string[];
  onMutate: (oldData: T | undefined, form: K) => T;
  successMessage?: ToastMessageInput;
  smartSuccessMessage?: (formData: V) => ToastMessageInput;
  onSuccessActionWithFormData?: (formData: V) => void;
}

export const FOR_CODE_COV = 1;
