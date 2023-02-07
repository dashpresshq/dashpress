import { useState } from "react";

import {
  Table,
  DEFAULT_TABLE_STATE,
  TableSkeleton,
  ITableColumn,
} from "@hadmean/chromista";
import { IPaginatedDataState } from "@hadmean/protozoa";
import { ViewStateMachine } from "../ViewStateMachine";
import { useFEPagination } from "./useFEPagination";

interface IProps {
  columns: ITableColumn[];
  dataEndpoint: string;
  emptyMessage?: string;
  border?: true;
}

export function FEPaginationTable<T extends Record<string, unknown>>({
  columns,
  dataEndpoint,
  emptyMessage,
  border,
}: IProps) {
  const [paginatedDataState, setPaginatedDataState] =
    useState<IPaginatedDataState<unknown>>(DEFAULT_TABLE_STATE);

  const tableData = useFEPagination<T>(dataEndpoint, {
    ...paginatedDataState,
    sortBy: paginatedDataState.sortBy,
    pageIndex: paginatedDataState.pageIndex + 1,
    filters: paginatedDataState.filters as unknown as Record<string, T>[],
  });

  return (
    <ViewStateMachine
      error={tableData.error}
      loading={tableData.isLoading}
      loader={<TableSkeleton />}
    >
      <Table
        {...{
          tableData,
          syncPaginatedDataStateOut: setPaginatedDataState,
          overridePaginatedDataState: DEFAULT_TABLE_STATE,
        }}
        border={border}
        emptyMessage={emptyMessage}
        columns={columns}
      />
    </ViewStateMachine>
  );
}
