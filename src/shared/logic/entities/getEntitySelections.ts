import type { IEntityField } from "shared/types/db";
import type {
  EntityTypesForSelection,
  IColorableSelection,
} from "shared/types/ui";
import { FIELD_TYPES_CONFIG_MAP } from "shared/validations/field-types-config";
import type { FormFieldTypes } from "shared/validations/types";

import { getEntitySelectionConfig } from "./getEntitySelectionConfig";

const FIELD_TYPE_TO_ENTITY_TYPES_MAP: Record<
  IEntityField["type"],
  FormFieldTypes
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
): FormFieldTypes => {
  if (isReference) {
    return "reference";
  }

  const entityFieldType = FIELD_TYPE_TO_ENTITY_TYPES_MAP[type];

  if (entityFieldType) {
    return entityFieldType;
  }
  return "text";
};

export const getEntitySelections = (
  entityFields: IEntityField[],
  entitySelections: Record<string, IColorableSelection[]>,
  entityFieldTypes: Record<string, FormFieldTypes>
): Record<string, IColorableSelection[]> => {
  const enumOptions = Object.fromEntries(
    entityFields
      .filter((field) => {
        return field.enumeration;
      })
      .map((field) => [field.name, field.enumeration])
  );

  return Object.fromEntries(
    entityFields
      .filter(
        ({ name }) =>
          FIELD_TYPES_CONFIG_MAP[entityFieldTypes[name]]?.configureSelection
      )
      .map(({ name }) => {
        const preSelectedType = (entitySelections || {})[name];

        const entityType = entityFieldTypes[name] as EntityTypesForSelection;

        return [
          name,
          getEntitySelectionConfig(
            entityType,
            preSelectedType,
            enumOptions[name]
          ),
        ];
      })
  );
};

export const getEntityFieldTypes = (
  entityFields: IEntityField[],
  entityFieldTypesMap: Record<string, FormFieldTypes>
) => {
  return Object.fromEntries(
    entityFields.map(({ name, type, isReference }) => {
      const preSelectedType = entityFieldTypesMap[name];

      return [name, preSelectedType ?? guessEntityType(type, isReference)];
    })
  );
};
