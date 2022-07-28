import { StringUtils } from "@gothicgeeks/shared";
import { runValidationError } from "./run";
import { ValidationTypes } from "./types";
import { ENTITY_VALIDATION_CONFIG } from "./validations-map";

interface IRequestValidationSchema {
  label?: string;
  validations: {
    validationType: ValidationTypes;
    constraint?: Record<string, string | number>;
  }[];
}

export type IRequestValidation = Record<string, IRequestValidationSchema>;

export const makeRequestValidationRunnable = (
  requestValidation: IRequestValidation
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
