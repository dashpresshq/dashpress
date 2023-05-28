import { ITableColumn, Table } from "@hadmean/chromista";
import { DEFAULT_PAGINATED_DATA, usePaginatedData } from "@hadmean/protozoa";
import { useTableState } from "../hooks";
import { IDataTableProps } from "../types";

interface IProps extends IDataTableProps {
  columns: ITableColumn[];
  enabled: boolean;
  dataEndpoint: string;
  stateStorageKey: string;
}

export function BaseDataTable({
  columns,
  enabled,
  stateStorageKey,
  dataEndpoint,
  lean,
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
      lean={lean}
      columns={columns}
    />
  );
}
