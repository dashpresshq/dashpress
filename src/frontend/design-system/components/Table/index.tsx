import * as React from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import styled, { css } from "styled-components";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { DEFAULT_TABLE_STATE } from "./constants";
import { ITableProps } from "./types";
import { getPageCount } from "./utils";
import { TablePagination } from "./_Pagination";
import { ErrorAlert } from "../Alert";
import { TableSkeleton } from "../Skeleton/Table";
import { TableHead } from "./Head";
import { TableBody } from "./Body";
import { TableFoot } from "./Foot";
import { useInternalColumns, useSyncTableState } from "./hooks";
import { BaseSkeleton } from "../Skeleton/Base";

export { DEFAULT_TABLE_STATE };

const TableResponsive = styled.div`
  display: block;
  width: 100%;
  -webkit-overflow-scrolling: touch;
`;

const TableRoot = styled.div<{ $enforceHeight?: boolean }>`
  position: relative;
  overflow-x: auto;
  background: ${USE_ROOT_COLOR("base-color")};
  ${(props) => props.$enforceHeight && `min-height: 500px;`}
`;

const TableStyles = styled.table<{ $border?: boolean }>`
  width: 100%;
  color: ${USE_ROOT_COLOR("main-text")};
  border-collapse: collapse;
  .dropdown-toggle::after {
    display: none;
  }

  ${(props) =>
    props.$border &&
    css`
      border-right: 1px solid ${USE_ROOT_COLOR("border-color")};
      border-left: 1px solid ${USE_ROOT_COLOR("border-color")};
    `}
`;

export function Table<T extends unknown>({
  overridePaginatedDataState,
  tableData,
  syncPaginatedDataStateOut,
  columns,
  lean,
  border,
  empty,
}: ITableProps<T>) {
  const {
    data = {
      data: [],
      pageIndex: 0,
      pageSize: DEFAULT_TABLE_STATE.pageSize,
      totalRecords: 0,
    },
    isLoading,
    error,
    isPreviousData,
  } = tableData;

  const totalPageCount = getPageCount(data.totalRecords, data.pageSize);

  const dataLength = data.data.length;

  const internalColumns = useInternalColumns(columns);

  const tableDataStringified = React.useMemo(() => {
    return data.data.map((datum) =>
      Object.fromEntries(
        Object.entries(datum).map(([key, value]) => [
          key,
          typeof value === "number" ? `${value}` : value,
        ])
      )
    );
  }, [data.data]);

  const table = useReactTable({
    data: tableDataStringified,
    pageCount: totalPageCount,
    columns: internalColumns,
    manualPagination: true,
    manualSorting: true,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  useSyncTableState(
    table,
    overridePaginatedDataState,
    syncPaginatedDataStateOut
  );

  if (error) {
    return <ErrorAlert message={error} />;
  }

  if (isLoading) {
    return <TableSkeleton lean={lean} />;
  }

  const previousDataRender = isPreviousData ? (
    <BaseSkeleton
      height="2px"
      width="100%"
      style={{
        background: USE_ROOT_COLOR("primary-color"),
      }}
    />
  ) : (
    <div
      style={{
        height: dataLength === 0 || lean ? "0px" : "2px",
        width: "100%",
        background: USE_ROOT_COLOR("soft-color"),
      }}
    />
  );

  return (
    <TableResponsive>
      <TableRoot $enforceHeight={dataLength > 0 && !lean}>
        {previousDataRender}
        <TableStyles $border={border}>
          <TableHead table={table} />
          <TableBody
            table={table}
            dataLength={dataLength}
            empty={empty}
            isLoading={isLoading}
          />
          <TableFoot table={table} dataLength={dataLength} />
        </TableStyles>
        {previousDataRender}
      </TableRoot>
      {!lean && (
        <TablePagination
          {...{
            setPageSize: table.setPageSize,
            totalRecords: data.totalRecords,
            pageSize: table.getState().pagination.pageSize,
            pageIndex: table.getState().pagination.pageIndex,
            totalPageCount,
            gotoPage: table.setPageIndex,
          }}
        />
      )}
    </TableResponsive>
  );
}
