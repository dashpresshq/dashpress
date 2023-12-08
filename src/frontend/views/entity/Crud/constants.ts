import { IEntityCrudSettings } from "shared/configurations";

export const makeEntityFieldsSelectionKey = (
  entity: string,
  crudKey: keyof IEntityCrudSettings | "table"
) => {
  return `${crudKey}-${entity}CrudEntityFieldsSelectionSettings}`;
};
