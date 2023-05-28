import { IEntityField } from "shared/types/db";

export const filterOutHiddenScalarColumns = (
  scalarFields: IEntityField[],
  hiddenColumns: string[]
) => scalarFields.filter(({ name }) => !hiddenColumns.includes(name));
