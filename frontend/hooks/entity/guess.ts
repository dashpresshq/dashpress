import { IFieldValidationItem } from "frontend/views/entity/Configure/Fields/FieldsValidation";
import {
  ENTITY_TYPES_SELECTION_BAG,
  ENTITY_VALIDATION_CONFIG,
  ValidationsBoundToType,
} from "../../../shared/validations.constants";
import { IEntityField } from "../../../backend/entities/types";

export const getFieldTypeBoundedValidations = (
  fieldType: keyof typeof ENTITY_TYPES_SELECTION_BAG
): IFieldValidationItem[] => {
  return Object.entries(ENTITY_VALIDATION_CONFIG)
    .filter(
      ([_, config]) =>
        config.isBoundToType && config.isBoundToType.includes(fieldType)
    )
    .map(([key, config]) => ({
      validationType: key as ValidationsBoundToType,
      errorMessage: config.message,
      fromType: true,
    }));
};

export const guessEntityValidations = (
  isUnique: IEntityField["isUnique"],
  isId: IEntityField["isId"],
  isRequired: IEntityField["isRequired"]
): IFieldValidationItem[] => {
  const validationItems: IFieldValidationItem[] = [];

  if (isUnique || isId) {
    const { message } = ENTITY_VALIDATION_CONFIG["unique"];
    validationItems.push({
      validationType: "unique",
      errorMessage: message, // TODO check after save message
      fromSchema: true,
    });
  }

  if (isRequired) {
    const { message } = ENTITY_VALIDATION_CONFIG["required"];
    validationItems.push({
      validationType: "required",
      errorMessage: message,
      fromSchema: true,
    });
  }
  // TODO guess the maxLength/max

  return validationItems;
};

export const guessEntityType = (
  name: string,
  kind: IEntityField["kind"],
  type: IEntityField["type"],
  entityReferenceMap: Record<string, string>
): keyof typeof ENTITY_TYPES_SELECTION_BAG => {
  if (entityReferenceMap[name]) {
    return "reference";
  }

  // Start guessing
  if (kind === "enum") {
    return "selection-enum";
  }

  const entityFieldType = FIELD_TYPE_TO_ENTITY_TYPES_MAP[type];

  if (entityFieldType) {
    return entityFieldType;
  }
  return "text";
};

const FIELD_TYPE_TO_ENTITY_TYPES_MAP: Record<
  IEntityField["type"],
  keyof typeof ENTITY_TYPES_SELECTION_BAG
> = {
  Boolean: "boolean",
  DateTime: "datetime-local",
  Int: "number",
  String: "text",
};
