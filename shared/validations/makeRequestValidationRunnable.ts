import { StringUtils } from "@gothicgeeks/shared";
import { ISchemaFormConfig } from "shared/form-schemas";
import { runValidationError } from "./run";
import { ENTITY_VALIDATION_CONFIG } from "./validations-map";

export type IRequestValidation<T> = Record<keyof T, ISchemaFormConfig>;

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
