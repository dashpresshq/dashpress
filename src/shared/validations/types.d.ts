import { MessageDescriptor } from "@lingui/core";

export type ValidationsBoundToType =
  | "isEmail"
  | "isUrl"
  | "isNumber"
  | "isString"
  | "isDate"
  // | "isReference"
  | "isBoolean"
  | "isJson"
  | "isColor";

export type SelectableAbleValidations =
  | "required"
  | "min"
  | "max"
  | "maxLength"
  | "minLength"
  | "isIn"
  | "regex"
  | "alphanumeric"
  | "isUpperCase"
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
  errorMessage?: MessageDescriptor;
  fromSchema?: true;
  fromType?: true;
  constraint?: Record<string, string | number | string[]>;
}

export type FormFieldTypes =
  | "email"
  | "password"
  | "text"
  | "textarea"
  | "richtext"
  | "url"
  | "number"
  | "json"
  | "selection"
  | "reference"
  | "boolean"
  | "selection-enum"
  | "file"
  | "image"
  | "datetime-local"
  | "color";
