import { Table, TableSkeleton } from "@hadmean/chromista";
import { usePaginatedData, SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { ENTITY_TABLE_PATH } from "../../../hooks/data/data.store";
import { useTableColumns } from "./useTableColumns";
import { useTableState } from "./hooks";
import { TableViewComponent } from "./portal";
import { ITableViewProps } from "./types";

export function EntityTableView({
  entity,
  lean,
  border,
  tabKey = "",
  persitentFilters = [],
  defaultTableState,
}: ITableViewProps) {
  const columns = useTableColumns(entity, lean);

  const [currentState, overridePaginatedDataState, setPaginatedDataState] =
    useTableState(`${entity}${tabKey}`, persitentFilters, defaultTableState);

  const tableData = usePaginatedData(ENTITY_TABLE_PATH(entity), currentState, {
    enabled: entity && entity !== SLUG_LOADING_VALUE,
  });

  const { error } = columns;

  const isLoading = entity === SLUG_LOADING_VALUE || columns.isLoading;

  return (
    <>
      <ViewStateMachine
        error={error}
        loading={isLoading}
        loader={<TableSkeleton lean={lean} />}
      >
        {!isLoading && (
          <Table
            {...{
              tableData,
              syncPaginatedDataStateOut: setPaginatedDataState,
              overridePaginatedDataState,
            }}
            border={border}
            lean={lean}
            columns={columns.data || []}
          />
        )}
      </ViewStateMachine>
      <TableViewComponent />
    </>
  );
}
