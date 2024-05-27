import { MessageDescriptor } from "@lingui/core";
import { FieldInputProps, FieldMetaState } from "react-final-form";
import { IFormInputRightAction } from "shared/form-schemas/types";

export interface ILabelAndErrorProps {
  input: FieldInputProps<any, HTMLElement>;
  meta: FieldMetaState<any>;
  label?: MessageDescriptor;
  description?: string;
  sm?: true;
  required?: boolean;
  rightActions?: IFormInputRightAction[];
}

export interface ISharedFormInput extends ILabelAndErrorProps {
  placeholder?: MessageDescriptor;
  disabled?: boolean;
}
