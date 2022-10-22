import { IEntityField } from "shared/types/db";

export const fitlerOutHiddenScalarColumns = (
  scalarFields: IEntityField[] = [],
  hiddenColumns: string[] = []
) => scalarFields.filter(({ name }) => !hiddenColumns.includes(name));
