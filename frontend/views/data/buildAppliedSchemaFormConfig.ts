import {
  IAppliedSchemaFormConfig,
  ISchemaFormConfig,
} from "shared/form-schemas";
import { ENTITY_LIST_PATH } from "frontend/hooks/data/data.store";

import { IColorableSelection } from "shared/types";
import { FIELD_TYPES_CONFIG_MAP } from "shared/validations";
import { IFieldValidationItem } from "shared/validations/types";
import { userFriendlyCase } from "../../lib/strings";

interface IEntitySchemaFormConfigProps {
  fields: string[];
  entityToOneReferenceFields: Record<string, string>;
  entityFieldSelections: Record<string, IColorableSelection[]>;
  getEntityFieldLabels: (name: string) => string;
  entityFieldTypes: Record<string, keyof typeof FIELD_TYPES_CONFIG_MAP>;
  entityValidationsMap: Record<string, IFieldValidationItem[]>;
}

export const buildAppliedSchemaFormConfig = ({
  fields,
  entityFieldTypes,
  entityToOneReferenceFields,
  entityFieldSelections,
  getEntityFieldLabels,
  entityValidationsMap,
}: IEntitySchemaFormConfigProps): IAppliedSchemaFormConfig<any> => {
  return Object.fromEntries(
    fields.map((field) => {
      return [
        field,
        {
          selections: entityFieldSelections[field] || [],
          selectionUrl:
            entityFieldTypes[field] === "reference"
              ? ENTITY_LIST_PATH(entityToOneReferenceFields[field])
              : undefined,
          type: entityFieldTypes[field] || {},
          label: getEntityFieldLabels(field) || userFriendlyCase(field),
          validations: entityValidationsMap[field] || [],
        } as ISchemaFormConfig,
      ];
    })
  );
};
