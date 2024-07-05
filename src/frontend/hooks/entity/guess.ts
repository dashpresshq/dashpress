import type { IEntityField } from "shared/types/db";
import type {
  FormFieldTypes,
  IFieldValidationItem,
} from "shared/validations/types";
import type { ValidationsBoundToType } from "shared/validations";
import { ENTITY_VALIDATION_CONFIG } from "shared/validations";
import { typescriptSafeObjectDotEntries } from "shared/lib/objects";

export const getFieldTypeBoundedValidations = (
  fieldType: FormFieldTypes
): IFieldValidationItem[] =>
  typescriptSafeObjectDotEntries(ENTITY_VALIDATION_CONFIG)
    .filter(
      ([, config]) =>
        config.isBoundToType && config.isBoundToType.includes(fieldType)
    )
    .map(([key, config]) => ({
      validationType: key as ValidationsBoundToType,
      errorMessage: config.message,
      fromType: true,
    }));

export const guessEntityValidations = ({
  isRequired,
  length,
}: Pick<IEntityField, "isRequired" | "length">): IFieldValidationItem[] => {
  const validationItems: IFieldValidationItem[] = [];

  if (isRequired) {
    const { message } = ENTITY_VALIDATION_CONFIG.required;
    validationItems.push({
      validationType: "required",
      errorMessage: message,
      fromSchema: true,
    });
  }

  if (length) {
    const { message } = ENTITY_VALIDATION_CONFIG.maxLength;
    validationItems.push({
      validationType: "maxLength",
      constraint: {
        length,
      },
      errorMessage: message,
      fromSchema: true,
    });
  }
  return validationItems;
};
