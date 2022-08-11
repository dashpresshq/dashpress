import { IColorableSelection } from "shared/types";
import { FIELD_TYPES_CONFIG_MAP } from "shared/validations";
import { IFieldValidationItem } from "shared/validations/types";

export interface ISchemaFormConfig {
  selections?: IColorableSelection[];
  selectionUrl?: string;
  type: keyof typeof FIELD_TYPES_CONFIG_MAP;
  label?: string;
  validations: IFieldValidationItem[];
}

export type IAppliedSchemaFormConfig<T> = Record<keyof T, ISchemaFormConfig>;
