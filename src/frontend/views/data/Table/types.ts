import { IPaginatedDataState } from "@hadmean/protozoa";
import { QueryFilter } from "shared/types/data";

export interface IDataTableProps {
  persitentFilters?: QueryFilter[];
  defaultTableState?: Pick<
    IPaginatedDataState<unknown>,
    "pageSize" | "sortBy" | "filters"
  >;
  lean?: true;
  border?: true;
}
