export interface IApiMutateOptions<T, K> {
  dataQueryPath: string;
  otherEndpoints?: string[];
  isOnMockingMode?: true;
  onMutate: (oldData: T | undefined, form: K) => T;
  successMessage?: { header: string; content: string } | string;
  smartSuccessMessage?: (
    formData: K
  ) => { header: string; content: string } | "string";
  onSuccessActionWithFormData?: (formData: K) => void;
}

export interface IWaitForResponseMutationOptions<T> {
  endpoints: string[];
  redirect?: string;
  onSuccessActionWithFormData?: (formData: T) => void;
  successMessage?:
    | string
    | {
        header: string;
        content: string;
      };
  smartSuccessMessage?: (formData: T) =>
    | string
    | {
        header: string;
        content: string;
      };
}
