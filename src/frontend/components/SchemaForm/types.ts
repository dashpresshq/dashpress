import { FormApi } from "final-form";
import { FieldInputProps, FieldMetaState } from "react-final-form";
import {
  IFormInputRightAction,
  ISchemaFormConfig,
} from "shared/form-schemas/types";
import { IColorableSelection } from "shared/types/ui";
import { FIELD_TYPES_CONFIG_MAP } from "shared/validations";

export interface IFormExtension {
  fieldsState: string;
  beforeSubmit: string;
}

export interface IRenderFormInputProps {
  type: keyof typeof FIELD_TYPES_CONFIG_MAP;
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
  label: string;
  placeholder?: string;
  description?: string;
  from?: string;
  rightActions?: IFormInputRightAction[];
}
