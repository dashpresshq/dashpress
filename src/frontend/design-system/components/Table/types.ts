import { HeaderContext } from "@tanstack/react-table";
import { ReactNode } from "react";
import { UseQueryResult } from "react-query";
import { IPaginatedDataState, PaginatedData } from "shared/types/data";
import { TableFilterType } from "./filters/types";

export interface ITableColumn {
  Header:
    | string
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

export interface IProps<T> {
  columns: ITableColumn[];
  tableData: Pick<
    UseQueryResult<PaginatedData<Record<string, unknown>>, unknown>,
    "data" | "isLoading" | "error" | "isPreviousData"
  >;
  lean?: true;
  border?: boolean;
  overridePaginatedDataState?: IPaginatedDataState<T>;
  syncPaginatedDataStateOut: (params: IPaginatedDataState<T>) => void;
  emptyMessage?: string;
}
