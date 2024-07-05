import { msg } from "@lingui/macro";
import {
  ENTITY_LIST_PATH,
  ENTITY_REFERENCE_PATH,
} from "frontend/hooks/data/constants";
import type {
  IAppliedSchemaFormConfig,
  ISchemaFormConfig,
} from "shared/form-schemas/types";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import type { IColorableSelection } from "shared/types/ui";
import type {
  FormFieldTypes,
  IFieldValidationItem,
} from "shared/validations/types";

interface IEntitySchemaFormConfigProps {
  fields: string[];
  entityToOneReferenceFields: Record<string, string>;
  entityFieldSelections: Record<string, IColorableSelection[]>;
  getEntityFieldLabels: (name: string) => string;
  entityFieldTypes: Record<string, FormFieldTypes>;
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
  {
    allOptional,
    fieldsToShow,
  }: { allOptional?: boolean; fieldsToShow?: string[] } = {}
): IAppliedSchemaFormConfig<any> => {
  return Object.fromEntries(
    fields
      .filter((field) => {
        if (!fieldsToShow) {
          return true;
        }
        return fieldsToShow.includes(field);
      })
      .map((field) => {
        const formConfig: ISchemaFormConfig<any> = {
          selections: entityFieldSelections[field] || [],
          apiSelections:
            entityFieldTypes[field] === "reference"
              ? {
                  listUrl: ENTITY_LIST_PATH(entityToOneReferenceFields[field]),
                  entity: entityToOneReferenceFields[field],
                  referenceUrl: (value: string) =>
                    ENTITY_REFERENCE_PATH({
                      entity: entityToOneReferenceFields[field],
                      entityId: value,
                    }),
                }
              : undefined,
          type: entityFieldTypes[field],
          label: getEntityFieldLabels(field)
            ? msg`${getEntityFieldLabels(field)}`
            : msg`${userFriendlyCase(field)}`,
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
