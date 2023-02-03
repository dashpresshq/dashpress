import { IPaginatedDataState } from "@hadmean/protozoa";
import { QueryFilter } from "shared/types/data";

export interface ITableViewProps {
  entity: string;
  lean?: true;
  persitentFilters?: QueryFilter[];
  defaultTableState?: Pick<
    IPaginatedDataState<unknown>,
    "pageSize" | "sortBy" | "filters"
  >;
}
