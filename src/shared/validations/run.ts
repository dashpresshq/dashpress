import { userFriendlyCase } from "shared/lib/strings";
import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { TemplateService } from "../lib/templates";
import { ENTITY_VALIDATION_CONFIG } from "./validations-map";

export const runValidationError =
  (fields: IAppliedSchemaFormConfig<any>) =>
  (values: Record<string, unknown>) => {
    const validations = Object.fromEntries(
      Object.entries(fields).map(([field, config]) => {
        const validationsToRun = config.validations || [];

        const firstFailedValidation = validationsToRun.find((validation) =>
          ENTITY_VALIDATION_CONFIG[validation.validationType]?.implementation(
            values[field],
            validation.errorMessage ||
              ENTITY_VALIDATION_CONFIG[validation.validationType].message,
            validation.constraint || {},
            values
          )
        );

        return [
          field,
          firstFailedValidation
            ? TemplateService.compile(
                firstFailedValidation.errorMessage ||
                  ENTITY_VALIDATION_CONFIG[firstFailedValidation.validationType]
                    .message,
                {
                  name: config.label || userFriendlyCase(field),
                  ...firstFailedValidation.constraint,
                }
              )
            : undefined,
        ];
      })
    );
    return validations;
  };
