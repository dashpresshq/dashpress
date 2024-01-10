import { FormApi } from "final-form";
import { ISharedFormInput } from "frontend/design-system/components/Form/_types";
import { FieldInputProps, FieldMetaState } from "react-final-form";
import { ISchemaFormConfig } from "shared/form-schemas/types";
import { IColorableSelection } from "shared/types/ui";
import { IAuthenticatedUserBag } from "shared/types/user";
import { FIELD_TYPES_CONFIG_MAP } from "shared/validations";

export interface IFormExtension {
  fieldsState: string;
  beforeSubmit: string;
}

export interface ISchemaFormScriptContext {
  routeParams: Record<string, string>;
  auth: IAuthenticatedUserBag;
  action: string;
}

export interface ISchemaFormScriptProps<T> extends ISchemaFormScriptContext {
  formValues: T;
}

export interface IRenderFormInputProps {
  type: keyof typeof FIELD_TYPES_CONFIG_MAP;
  renderProps: {
    input: FieldInputProps<any, HTMLElement>;
    meta: FieldMetaState<any>;
  };
  apiSelections?: ISchemaFormConfig<any>["apiSelections"];
  entityFieldSelections?: IColorableSelection[];
  required: boolean;
  disabled: boolean;
  form: FormApi;
  label: string;
  placeholder?: string;
  description?: string;
  rightActions?: ISharedFormInput["rightActions"];
}
