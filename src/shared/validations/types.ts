export type ValidationsBoundToType =
  | "isEmail"
  | "isUrl"
  | "isNumber"
  | "isString"
  | "isDate"
  | "isReference"
  | "isBoolean"
  | "isJson"
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
  | "doesntMatchOtherField"
  | "lessThanOtherField"
  | "greaterThanOtherField"
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

export const FOR_CODE_COV = 1;
