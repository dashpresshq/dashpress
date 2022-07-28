import { TemplateService } from "../lib/templates";
import { IFieldValidationItem } from "./types";
import { ENTITY_VALIDATION_CONFIG } from "./validations-map";

export const runValidationError =
  (
    fields: string[],
    entityValidationsMap: Record<string, IFieldValidationItem[]>,
    getEntityFieldLabels: (input: string) => string
  ) =>
  (values: Record<string, unknown>) => {
    const validations = Object.fromEntries(
      fields.map((field) => {
        const validationsToRun = entityValidationsMap[field] || [];

        const firstFailedValidation = validationsToRun.find((validation) =>
          ENTITY_VALIDATION_CONFIG[validation.validationType]?.implementation(
            values[field],
            validation.errorMessage,
            validation.constraint || {},
            values
          )
        );

        return [
          field,
          firstFailedValidation
            ? TemplateService.compile(firstFailedValidation.errorMessage, {
                name: getEntityFieldLabels(field),
                ...firstFailedValidation.constraint,
              })
            : undefined,
        ];
      })
    );
    return validations;
  };
