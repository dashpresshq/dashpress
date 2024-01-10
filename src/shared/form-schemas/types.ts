import { ISchemaFormScriptProps } from "frontend/components/SchemaForm/types";
import { ISharedFormInput } from "frontend/design-system/components/Form/_types";
import { GridSpanSizes, IColorableSelection } from "shared/types/ui";
import { FIELD_TYPES_CONFIG_MAP } from "shared/validations";
import { IFieldValidationItem } from "shared/validations/types";

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
  rightActions?: ISharedFormInput["rightActions"];
  validations: IFieldValidationItem[];
};

export type IAppliedSchemaFormConfig<T> = Record<keyof T, ISchemaFormConfig<T>>;

export const FOR_CODE_COV = 1;
