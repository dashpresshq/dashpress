import type { MessageDescriptor } from "@lingui/core";
import type { UseQueryResult } from "@tanstack/react-query";
import type { HeaderContext } from "@tanstack/react-table";
import type { ReactNode } from "react";

import type {
  IPaginatedDataState,
  PaginatedData,
  TableFilterType,
} from "@/shared/types/data";

import type { IEmptyWrapperProps } from "../empty-wrapper/types";

export interface ITableColumn {
  Header:
    | MessageDescriptor
    | ((
        headerContext: HeaderContext<Record<string, unknown>, unknown>
      ) => ReactNode);
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
