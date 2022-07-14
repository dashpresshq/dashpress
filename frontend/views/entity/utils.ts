import { IEntityField } from "shared/types";

export const fitlerOutHiddenScalarColumns = (
  scalarFields: { data?: IEntityField[] },
  hiddenColumns: { data?: string[] }
) =>
  (scalarFields.data || []).filter(
    ({ name }) => !(hiddenColumns.data || []).includes(name)
  );
