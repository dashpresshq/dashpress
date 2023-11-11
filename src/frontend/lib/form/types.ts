export interface IFormProps<T> {
  onSubmit: (arg0: T) => Promise<void>;
  initialValues?: Partial<T>;
}

export const FOR_CODE_COV = 1;
