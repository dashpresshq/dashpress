export type ValidationsBoundToType =
  | "isEmail"
  | "isUrl"
  | "isNumber"
  | "isString"
  | "isDate"
  | "isReference"
  | "isBoolean"
  | "isColor";

export type SelectableAbleValidations =
  | "required"
  | "unique"
  | "min"
  | "max"
  | "maxLength"
  | "minLength"
  | "isIn"
  | "regex"
  | "alphanumeric"
  | "matchOtherField"
  | "postiveNumber";

export type ValidationTypes =
  | ValidationsBoundToType
  | SelectableAbleValidations;

export interface IFieldValidationItem {
  validationType: ValidationTypes;
  errorMessage?: string;
  fromSchema?: true;
  fromType?: true;
  constraint?: Record<string, string | number | string[]>;
}
