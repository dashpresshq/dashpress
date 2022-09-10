import { IEntityField } from "shared/types";

export const fitlerOutHiddenScalarColumns = (
  scalarFields: IEntityField[] = [],
  hiddenColumns: string[] = []
) => scalarFields.filter(({ name }) => !hiddenColumns.includes(name));
