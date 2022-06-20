export interface IFormProps<T> {
  onSubmit: (arg0: T) => void;
  initialValues?: Partial<T>;
}
