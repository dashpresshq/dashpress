import { useAppConfiguration } from "frontend/hooks/configuration/configuration.store";
import { IEntityCrudSettings } from "shared/configurations";
import { IEntityField } from "shared/types/db";

export const useIsEntityFieldMutatable = (
  crudKey: keyof IEntityCrudSettings | "table"
) => {
  const metaDataColumns = useAppConfiguration("metadata_columns");

  return (entityField: IEntityField) => {
    if (entityField.isId) {
      return false;
    }

    if (
      (crudKey === "create" || crudKey === "update") &&
      [metaDataColumns.data.createdAt, metaDataColumns.data.updatedAt].includes(
        entityField.name
      )
    ) {
      return false;
    }

    return true;
  };
};
