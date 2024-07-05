import type { ReactNode } from "react";
import { useState } from "react";
import type { IPaginatedDataState, TableFilterType } from "shared/types/data";
import type { MessageDescriptor } from "@lingui/core";
import { TableSkeleton } from "@/components/app/skeleton/table";
import type { IEmptyWrapperProps } from "../empty-wrapper/types";
import { useFEPagination } from "./useFEPagination";
import { ViewStateMachine } from "../view-state-machine";
import { DEFAULT_TABLE_STATE, Table } from "../table";
import type { ITableColumn } from "../table/types";

export interface IFETableCell<T> {
  row: {
    original: T;
  };
  value: unknown;
}

export interface IFETableColumn<T extends Record<string, unknown>> {
  Header: MessageDescriptor;
  accessor: keyof T | "__action__";
  disableSortBy?: boolean;
  filter?: TableFilterType;
  Cell?: ({ row, value }: IFETableCell<T>) => ReactNode;
}

interface IProps<T extends Record<string, unknown>> {
  columns: IFETableColumn<T>[];
  dataEndpoint: string;
  empty: IEmptyWrapperProps;
  border?: true;
}

export function FEPaginationTable<T extends Record<string, unknown>>({
  columns,
  dataEndpoint,
  empty,
  border,
}: IProps<T>) {
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
        empty={empty}
        columns={columns as ITableColumn[]}
      />
    </ViewStateMachine>
  );
}
