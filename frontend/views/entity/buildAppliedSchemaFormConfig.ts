import {
  IAppliedSchemaFormConfig,
  ISchemaFormConfig,
} from "shared/form-schemas";
import { ENTITY_LIST_PATH } from "frontend/hooks/data/data.store";
import { IBaseEntityForm, IEntityFormSettings } from "./types";
import { userFriendlyCase } from "../../lib/strings";

export const buildAppliedSchemaFormConfig = ({
  fields,
  entityFieldTypes,
  entityToOneReferenceFields,
  entityFieldSelections,
  getEntityFieldLabels,
  entityValidationsMap,
}: IBaseEntityForm & IEntityFormSettings): IAppliedSchemaFormConfig<any> => {
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
