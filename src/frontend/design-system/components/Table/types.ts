import { ReactNode } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import {
  IPaginatedDataState,
  PaginatedData,
  TableFilterType,
} from "shared/types/data";
import { MessageDescriptor } from "@lingui/core";
import { IEmptyWrapperProps } from "../EmptyWrapper/types";

export interface ITableColumn {
  Header: MessageDescriptor;
  accessor: string;
  disableSortBy?: boolean;
  filter?: TableFilterType;
  Cell?: (cellProps: {
    value: unknown;
    row: { original: Record<string, unknown> };
  }) => ReactNode;
}

export interface ITableProps<T> {
  columns: ITableColumn[];
  tableData: Pick<
    UseQueryResult<PaginatedData<Record<string, unknown>>, unknown>,
    "data" | "isLoading" | "error" | "isPlaceholderData"
  >;
  lean?: true;
  border?: boolean;
  overridePaginatedDataState?: IPaginatedDataState<T>;
  syncPaginatedDataStateOut: (params: IPaginatedDataState<T>) => void;
  empty: IEmptyWrapperProps;
}
