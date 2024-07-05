import type { MessageDescriptor } from "@lingui/core";
import type { FieldInputProps, FieldMetaState } from "react-final-form";
import type { IFormInputRightAction } from "shared/form-schemas/types";

export interface ILabelAndErrorProps {
  input: FieldInputProps<any, HTMLElement>;
  meta: FieldMetaState<any>;
  label?: MessageDescriptor;
  description?: string;
  required?: boolean;
  rightActions?: IFormInputRightAction[];
}

export interface ISharedFormInput extends ILabelAndErrorProps {
  placeholder?: MessageDescriptor;
  disabled?: boolean;
}

export interface IBaseFormSelect extends ISharedFormInput {
  disabledOptions?: string[];
}
