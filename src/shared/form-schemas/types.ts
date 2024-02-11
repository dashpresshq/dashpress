import { SystemIconsKeys } from "shared/constants/Icons";
import { IEvaluateScriptContext } from "shared/types/forms";
import { GridSpanSizes, IColorableSelection } from "shared/types/ui";
import { FIELD_TYPES_CONFIG_MAP } from "shared/validations";
import { IFieldValidationItem } from "shared/validations/types";

export type ISchemaFormScriptProps<T> = IEvaluateScriptContext & {
  formValues: T;
  action: string;
};

export interface IFormInputRightAction {
  label: string;
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
  type: keyof typeof FIELD_TYPES_CONFIG_MAP;
  label?: string;
  placeholder?: string;
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
