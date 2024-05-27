export interface IFormProps<T> {
  onSubmit: (arg0: T) => Promise<void | T>;
  initialValues?: Partial<T>;
}
