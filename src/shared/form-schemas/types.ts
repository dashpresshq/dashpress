import { GridSpanSizes, IColorableSelection } from "shared/types/ui";
import { IAuthenticatedUserBag } from "shared/types/user";
import { FIELD_TYPES_CONFIG_MAP } from "shared/validations";
import { IFieldValidationItem } from "shared/validations/types";

export interface ISchemaFormScriptContext {
  routeParams: Record<string, string>;
  auth: IAuthenticatedUserBag;
  action: string;
}

export interface ISchemaFormScriptProps<T> extends ISchemaFormScriptContext {
  formValues: T;
}

export interface IFormInputRightAction {
  label: string;
  action: () => void;
}

export type ISchemaFormConfig<T> = {
  selections?: IColorableSelection[];
  apiSelections?: {
    listUrl: string;
    entity?: string;
    referenceUrl?: (value: string) => string;
  };
  type: keyof typeof FIELD_TYPES_CONFIG_MAP;
  label?: string;
  placeholder?: string;
  description?: string;
  formState?: ($: ISchemaFormScriptProps<T>) => {
    hidden?: boolean;
    disabled?: boolean;
  };
  span?: GridSpanSizes;
  rightActions?: IFormInputRightAction[];
  validations: IFieldValidationItem[];
};

export type IAppliedSchemaFormConfig<T> = Record<keyof T, ISchemaFormConfig<T>>;

export const FOR_CODE_COV = 1;
