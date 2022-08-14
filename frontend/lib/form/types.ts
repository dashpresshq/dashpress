export interface IFormProps<T> {
  onSubmit: (arg0: T) => Promise<void>;
  initialValues?: Partial<T>;
}

export interface IFormCustomization {
  fieldsState: string;
  beforeSubmit: string;
  afterSubmit: string;
}
