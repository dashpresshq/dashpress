import { IEntityField } from "shared/types/db";
import { IFieldValidationItem } from "shared/validations/types";
import {
  FIELD_TYPES_CONFIG_MAP,
  ENTITY_VALIDATION_CONFIG,
  ValidationsBoundToType,
} from "../../../shared/validations";

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

  // Handle isUnique more gracefully from relationships
  // since we can have more than 1 field in a uniqueness

  if (isRequired) {
    const { message } = ENTITY_VALIDATION_CONFIG.required;
    validationItems.push({
      validationType: "required",
      errorMessage: message,
      fromSchema: true,
    });
  }

  if (length) {
    const { message } = ENTITY_VALIDATION_CONFIG.required;
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

const FIELD_TYPE_TO_ENTITY_TYPES_MAP: Record<
  IEntityField["type"],
  keyof typeof FIELD_TYPES_CONFIG_MAP
> = {
  boolean: "boolean",
  date: "datetime-local",
  number: "number",
  string: "text",
  enum: "selection-enum",
};

export const guessEntityType = (
  type: IEntityField["type"],
  isReference?: IEntityField["isReference"]
): keyof typeof FIELD_TYPES_CONFIG_MAP => {
  if (isReference) {
    return "reference";
  }

  const entityFieldType = FIELD_TYPE_TO_ENTITY_TYPES_MAP[type];

  if (entityFieldType) {
    return entityFieldType;
  }
  return "text";
};
