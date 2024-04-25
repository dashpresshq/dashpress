import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { compileTemplateString } from "shared/lib/strings/templates";
import { typescriptSafeObjectDotEntries } from "shared/lib/objects";
import { ENTITY_VALIDATION_CONFIG } from "./validations-map";

export const runValidationError =
  (fields: IAppliedSchemaFormConfig<any>) =>
  (values: Record<string, unknown>) => {
    const validations = Object.fromEntries(
      typescriptSafeObjectDotEntries(fields).map(([field, config]) => {
        const validationsToRun = config.validations || [];

        const firstFailedValidation = validationsToRun.find((validation) =>
          ENTITY_VALIDATION_CONFIG[validation.validationType]?.implementation(
            values[String(field)],
            validation.errorMessage ||
              ENTITY_VALIDATION_CONFIG[validation.validationType].message,
            validation.constraint || {},
            values
          )
        );

        return [
          field,
          firstFailedValidation
            ? compileTemplateString(
                firstFailedValidation.errorMessage ||
                  ENTITY_VALIDATION_CONFIG[firstFailedValidation.validationType]
                    .message,
                {
                  name: config.label || userFriendlyCase(String(field)),
                  ...firstFailedValidation.constraint,
                }
              )
            : undefined,
        ];
      })
    );
    return validations;
  };
