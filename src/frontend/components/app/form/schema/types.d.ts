import type { MessageDescriptor } from "@lingui/core";
import type { FormApi } from "final-form";
import type { FieldInputProps, FieldMetaState } from "react-final-form";

import type {
  IFormInputRightAction,
  ISchemaFormConfig,
} from "@/shared/form-schemas/types";
import type { IColorableSelection } from "@/shared/types/ui";
import type { FormFieldTypes } from "@/shared/validations/types";

export interface IFormExtension {
  fieldsState: string;
  beforeSubmit: string;
}

export interface IRenderFormInputProps {
  type: FormFieldTypes;
  formProps: {
    input: FieldInputProps<any, HTMLElement>;
    meta: FieldMetaState<any>;
  };
  apiSelections?: ISchemaFormConfig<any>["apiSelections"];
  entityFieldSelections?: IColorableSelection[];
  required: boolean;
  disabled: boolean;
  onChange?: (value: unknown) => void;
  form: FormApi;
  label: MessageDescriptor;
  placeholder?: MessageDescriptor;
  description?: string;
  from?: string;
  rightActions?: IFormInputRightAction[];
}
