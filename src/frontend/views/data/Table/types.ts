import { IPaginatedDataState } from "@hadmean/protozoa";
import { FieldQueryFilter } from "shared/types/data";

export interface IDataTableProps {
  persitentFilters?: FieldQueryFilter[];
  defaultTableState?: Pick<
    IPaginatedDataState<unknown>,
    "pageSize" | "sortBy" | "filters"
  >;
  border?: true;
}
