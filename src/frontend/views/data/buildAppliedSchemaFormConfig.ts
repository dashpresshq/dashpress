import {
  IAppliedSchemaFormConfig,
  ISchemaFormConfig,
} from "shared/form-schemas/types";
import {
  ENTITY_LIST_PATH,
  ENTITY_REFERENCE_PATH,
} from "frontend/hooks/data/constants";

import { IColorableSelection } from "shared/types/ui";
import { FIELD_TYPES_CONFIG_MAP } from "shared/validations";
import { IFieldValidationItem } from "shared/validations/types";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";

interface IEntitySchemaFormConfigProps {
  fields: string[];
  entityToOneReferenceFields: Record<string, string>;
  entityFieldSelections: Record<string, IColorableSelection[]>;
  getEntityFieldLabels: (name: string) => string;
  entityFieldTypes: Record<string, keyof typeof FIELD_TYPES_CONFIG_MAP>;
  entityValidationsMap: Record<string, IFieldValidationItem[]>;
}

export const buildAppliedSchemaFormConfig = (
  {
    fields,
    entityFieldTypes,
    entityToOneReferenceFields,
    entityFieldSelections,
    getEntityFieldLabels,
    entityValidationsMap,
  }: IEntitySchemaFormConfigProps,
  allOptional?: boolean
): IAppliedSchemaFormConfig<any> => {
  return Object.fromEntries(
    fields.map((field) => {
      const formConfig: ISchemaFormConfig = {
        selections: entityFieldSelections[field] || [],
        apiSelections:
          entityFieldTypes[field] === "reference"
            ? {
                listUrl: ENTITY_LIST_PATH(entityToOneReferenceFields[field]),
                referenceUrl: (value: string) =>
                  ENTITY_REFERENCE_PATH({
                    entity: entityToOneReferenceFields[field],
                    entityId: value,
                  }),
              }
            : undefined,
        type: entityFieldTypes[field],
        label: getEntityFieldLabels(field) || userFriendlyCase(field),
        validations: (entityValidationsMap[field] || []).filter(
          ({ validationType }) => {
            if (allOptional) {
              return validationType !== "required";
            }
            return true;
          }
        ),
      };
      return [field, formConfig];
    })
  );
};
