import type { CrudViewsKeys } from "@/shared/configurations";

export const makeEntityFieldsSelectionKey = (
  entity: string,
  crudKey: CrudViewsKeys
) => {
  return `${crudKey}-${entity}CrudEntityFieldsSelectionSettings}`;
};
