import { IEntityField } from '../../../backend/entities/types';

export const fitlerOutHiddenScalarColumns = (
  scalarFields: { data?: IEntityField[] },
  hiddenColumns: { data?: string[] },
) => (scalarFields.data || []).filter(({ name }) => !(hiddenColumns.data || []).includes(name));
