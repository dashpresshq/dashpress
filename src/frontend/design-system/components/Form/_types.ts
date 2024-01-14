import { FieldInputProps, FieldMetaState } from "react-final-form";
import { IFormInputRightAction } from "shared/form-schemas/types";

export interface ISharedFormInput {
  input: FieldInputProps<any, HTMLElement>;
  meta: FieldMetaState<any>;
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  sm?: true;
  rightActions?: IFormInputRightAction[];
}

export const FOR_CODE_COV = 1;
