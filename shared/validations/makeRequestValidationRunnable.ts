import { StringUtils } from "@gothicgeeks/shared";
import { IAppliedSchemaFormConfig } from "shared/form-schemas";
import { runValidationError } from "./run";
import { ENTITY_VALIDATION_CONFIG } from "./validations-map";

export const makeRequestValidationRunnable = (
  requestValidation: IAppliedSchemaFormConfig<any>
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
