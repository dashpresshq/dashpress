import { ITableColumn, Table } from "@hadmean/chromista";
import {
  DEFAULT_PAGINATED_DATA,
  StringUtils,
  usePaginatedData,
} from "@hadmean/protozoa";
import { ICrudConfig } from "frontend/lib/makeCrudConfig";
import { useTableState } from "../hooks";
import { IDataTableProps } from "../types";

interface IProps extends IDataTableProps {
  columns: ITableColumn[];
  enabled: boolean;
  dataEndpoint: string;
  stateStorageKey: string;
  crudConfig: ICrudConfig;
}

export function BaseDataTable({
  columns,
  enabled,
  stateStorageKey,
  dataEndpoint,
  crudConfig,
  border,
  persitentFilters = [],
  defaultTableState,
}: IProps) {
  const [currentState, overridePaginatedDataState, setPaginatedDataState] =
    useTableState(stateStorageKey, persitentFilters, defaultTableState);

  const tableData = usePaginatedData(dataEndpoint, currentState, {
    enabled,
    defaultData: DEFAULT_PAGINATED_DATA,
  });

  return (
    <Table
      {...{
        tableData,
        syncPaginatedDataStateOut: setPaginatedDataState,
        overridePaginatedDataState,
      }}
      border={border}
      emptyMessage={
        currentState.filters.length > 0
          ? // TODO for contributors: transform this to user readable message
            `No result for the current ${StringUtils.pluralize({
              singular: "filter",
              count: currentState.filters.length,
              inclusive: true,
            })} applied.`
          : crudConfig.TEXT_LANG.EMPTY_LIST
      }
      columns={columns}
    />
  );
}
