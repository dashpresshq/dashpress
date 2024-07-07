import type {
  FieldQueryFilter,
  IPaginatedDataState,
} from "@/shared/types/data";

export interface IDataTableProps {
  persistentFilters?: FieldQueryFilter[];
  skipColumns?: string[];
  defaultTableState?: Pick<
    IPaginatedDataState<unknown>,
    "pageSize" | "sortBy" | "filters"
  >;
  border?: true;
}
