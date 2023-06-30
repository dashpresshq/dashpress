import { FieldInputProps, FieldMetaState } from "react-final-form";

export interface ISharedFormInput {
  input: FieldInputProps<any, HTMLElement>;
  meta: FieldMetaState<any>;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  sm?: true;
  rightActions?: {
    label: string;
    action: () => void;
  }[];
}

export const FOR_CODE_COV = 1;
