import { GridSpanSizes } from "frontend/design-system/constants/grid";
import { IColorableSelection } from "shared/types/ui";
import { FIELD_TYPES_CONFIG_MAP } from "shared/validations";
import { IFieldValidationItem } from "shared/validations/types";

export interface ISchemaFormConfig {
  selections?: IColorableSelection[];
  apiSelections?: {
    listUrl: string;
    referenceUrl?: (value: string) => string;
  };
  type: keyof typeof FIELD_TYPES_CONFIG_MAP;
  label?: string;
  placeholder?: string;
  description?: string;
  span?: GridSpanSizes;
  validations: IFieldValidationItem[];
}

export type IAppliedSchemaFormConfig<T> = Record<keyof T, ISchemaFormConfig>;

export const FOR_CODE_COV = 1;
