import { usePaginatedData } from "frontend/lib/data/useApi/usePaginatedData";
import { DEFAULT_PAGINATED_DATA } from "frontend/lib/data/constants/defaults";
import { pluralize } from "shared/lib/strings";
import { ITableColumn } from "frontend/design-system/components/Table/types";
import { Table } from "frontend/design-system/components/Table";
import { IEmptyWrapperProps } from "frontend/design-system/components/EmptyWrapper/types";
import { msg, t } from "@lingui/macro";
import { useTableState } from "../hooks";
import { IDataTableProps } from "../types";

interface IProps extends IDataTableProps {
  columns: ITableColumn[];
  dataEndpoint: string;
  stateStorageKey: string;
  empty: IEmptyWrapperProps;
}

export function BaseDataTable({
  columns,
  stateStorageKey,
  dataEndpoint,
  empty,
  skipColumns = [],
  border,
  persistentFilters = [],
  defaultTableState,
}: IProps) {
  const [currentState, overridePaginatedDataState, setPaginatedDataState] =
    useTableState(stateStorageKey, persistentFilters, defaultTableState);

  const tableData = usePaginatedData(dataEndpoint, currentState, {
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
      empty={
        currentState.filters.length > 0 &&
        persistentFilters.length !== currentState.filters.length
          ? // TODO: for contributors: transform this to user readable message
            {
              text: msg`No result for the current ${pluralize({
                singular: t`filter`,
                count: currentState.filters.length,
                inclusive: true,
              })} applied.`,
            }
          : empty
      }
      columns={columns.filter(
        (column) => !skipColumns.includes(column.accessor)
      )}
    />
  );
}
