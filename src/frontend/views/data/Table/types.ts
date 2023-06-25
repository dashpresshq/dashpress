import { FieldQueryFilter, IPaginatedDataState } from "shared/types/data";

export interface IDataTableProps {
  persitentFilters?: FieldQueryFilter[];
  defaultTableState?: Pick<
    IPaginatedDataState<unknown>,
    "pageSize" | "sortBy" | "filters"
  >;
  border?: true;
}
