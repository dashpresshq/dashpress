import { MessageDescriptor } from "@lingui/core";
import { SystemIconsKeys } from "shared/constants/Icons";
import { IEvaluateScriptContext } from "shared/types/forms";
import { GridSpanSizes, IColorableSelection } from "shared/types/ui";
import { FormFieldTypes, IFieldValidationItem } from "shared/validations/types";

export type ISchemaFormScriptProps<T> = IEvaluateScriptContext & {
  formValues: T;
  action: string;
};

export interface IFormInputRightAction {
  label: MessageDescriptor;
  action: string | (() => void);
  systemIcon: SystemIconsKeys;
}

export type ISchemaFormConfig<T> = {
  selections?: IColorableSelection[];
  apiSelections?: {
    listUrl: string;
    entity?: string;
    referenceUrl?: (value: string) => string;
  };
  type: FormFieldTypes;
  label?: MessageDescriptor;
  placeholder?: MessageDescriptor;
  description?: string;
  formState?: ($: ISchemaFormScriptProps<T>) => {
    hidden?: boolean;
    disabled?: boolean;
  };
  onChange?: (value: unknown) => void;
  span?: GridSpanSizes;
  rightActions?: IFormInputRightAction[];
  validations: IFieldValidationItem[];
};

export type IAppliedSchemaFormConfig<T> = Record<keyof T, ISchemaFormConfig<T>>;

export const FOR_CODE_COV = 1;
