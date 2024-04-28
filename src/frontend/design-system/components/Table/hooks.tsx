import { IPaginatedDataState } from "shared/types/data";
import {
  ColumnFiltersState,
  createColumnHelper,
  Table,
  Updater,
} from "@tanstack/react-table";
import { useEffect, useMemo } from "react";
import { usePrevious } from "react-use";
import { useToggle } from "frontend/hooks/state/useToggleState";
import { useLingui } from "@lingui/react";
import { ITableColumn } from "./types";
import {
  buildTableStateToRefreshPageNumber,
  internalTableStateToStandard,
} from "./utils";

const columnHelper = createColumnHelper<Record<string, unknown>>();

export const useInternalColumns = (columns: ITableColumn[]) => {
  const { _ } = useLingui();
  return useMemo(() => {
    return columns.map((column) => {
      const header =
        typeof column.Header === "function" ? column.Header : _(column.Header);

      return columnHelper.accessor(column.accessor, {
        id: column.accessor,
        meta: {
          filter: column.filter,
        },
        enableSorting: !column.disableSortBy,
        header,
        footer: header,
        enableColumnFilter: !!column.filter,
        cell: (props) =>
          column?.Cell
            ? column?.Cell({ value: props.getValue(), row: props.row })
            : props.getValue(),
      });
    });
  }, [columns]);
};

export function useSyncTableState<T>(
  table: Table<Record<string, unknown>>,
  overridePaginatedDataState: IPaginatedDataState<T> | undefined,
  syncPaginatedDataStateOut: (params: IPaginatedDataState<T>) => void
) {
  const resetPage = useToggle(true);
  const tableState = internalTableStateToStandard<T>(table.getState());
  const previousTableState = usePrevious<IPaginatedDataState<T>>(tableState);

  useEffect(() => {
    if (
      resetPage.isOn &&
      buildTableStateToRefreshPageNumber(previousTableState) !==
        buildTableStateToRefreshPageNumber(tableState)
    ) {
      table.setPageIndex(0);
    }
    resetPage.on();
    syncPaginatedDataStateOut(tableState);
  }, [JSON.stringify(tableState)]);

  useEffect(() => {
    if (!overridePaginatedDataState) {
      return;
    }

    resetPage.off();

    if (overridePaginatedDataState.pageSize) {
      table.setPageSize(overridePaginatedDataState.pageSize);
    }

    if (overridePaginatedDataState.sortBy) {
      table.setSorting(overridePaginatedDataState.sortBy);
    }

    if (overridePaginatedDataState.filters) {
      table.setColumnFilters(
        overridePaginatedDataState.filters as unknown as Updater<ColumnFiltersState>
      );
    }

    if (typeof overridePaginatedDataState.pageIndex === "number") {
      table.setPageIndex(overridePaginatedDataState.pageIndex);
    }
  }, [JSON.stringify(overridePaginatedDataState)]);
}
