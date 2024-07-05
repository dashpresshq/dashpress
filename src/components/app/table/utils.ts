import type { IPaginatedDataState } from "shared/types/data";
import type { TableState } from "@tanstack/react-table";
import { DEFAULT_TABLE_STATE } from "./constants";

export function getPageCount(totalRecords: number, pageSize?: number) {
  return totalRecords === 0
    ? 0
    : Math.ceil(totalRecords / (pageSize ?? DEFAULT_TABLE_STATE.pageSize));
}

export function buildTableStateToRefreshPageNumber(
  input: IPaginatedDataState<unknown> | undefined
) {
  return JSON.stringify([
    input?.filters || [],
    input?.pageSize || DEFAULT_TABLE_STATE.pageSize,
    input?.sortBy || [],
  ]);
}

export function internalTableStateToStandard<T>(
  tableState: TableState
): IPaginatedDataState<T> {
  return {
    pageIndex: tableState.pagination.pageIndex,
    pageSize: tableState.pagination.pageSize,
    filters: tableState.columnFilters as unknown as Record<string, T>[],
    sortBy: tableState.sorting,
  };
}
