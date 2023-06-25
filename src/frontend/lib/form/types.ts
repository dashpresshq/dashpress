export interface IFormProps<T> {
  onSubmit: (arg0: T) => Promise<void>;
  initialValues?: Partial<T>;
}
