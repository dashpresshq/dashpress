import {
  IAppliedSchemaFormConfig,
  ISchemaFormConfig,
} from "shared/form-schemas";
import { IBaseEntityForm, IEntityFormSettings } from "./types";
import { userFriendlyCase } from "../../lib/strings";

export const buildAppliedSchemaFormConfig = ({
  fields,
  entityFieldTypes,
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
          type: entityFieldTypes[field] || {},
          label: getEntityFieldLabels(field) || userFriendlyCase(field),
          validations: entityValidationsMap[field] || [],
        } as ISchemaFormConfig,
      ];
    })
  );
};
