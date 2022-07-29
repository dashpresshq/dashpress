import { StringUtils } from "@gothicgeeks/shared";
import { runValidationError } from "./run";
import { IFieldValidationItem, ValidationTypes } from "./types";
import { ENTITY_VALIDATION_CONFIG } from "./validations-map";

interface IRequestValidationSchema {
  label?: string;
  validations: {
    validationType: ValidationTypes;
    constraint?: IFieldValidationItem["constraint"];
  }[];
}

export type IRequestValidation<T> = Record<keyof T, IRequestValidationSchema>;

export const makeRequestValidationRunnable = (
  requestValidation: IRequestValidation<any>
) =>
  runValidationError(
    Object.keys(requestValidation),
    Object.fromEntries(
      Object.entries(requestValidation).map(([key, options]) => {
        return [
          key,
          options.validations.map(({ validationType, constraint }) => ({
            validationType,
            errorMessage: ENTITY_VALIDATION_CONFIG[validationType].message,
            constraint,
          })),
        ];
      })
    ),
    (field) =>
      requestValidation[field].label || StringUtils.upperCaseFirstLetter(field)
  );
