import { IEntityField } from "shared/types/db";
import { IFieldValidationItem } from "shared/validations/types";
import {
  FIELD_TYPES_CONFIG_MAP,
  ENTITY_VALIDATION_CONFIG,
  ValidationsBoundToType,
} from "shared/validations";

export const getFieldTypeBoundedValidations = (
  fieldType: keyof typeof FIELD_TYPES_CONFIG_MAP
): IFieldValidationItem[] =>
  Object.entries(ENTITY_VALIDATION_CONFIG)
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
