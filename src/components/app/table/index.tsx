import * as React from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { typescriptSafeObjectDotEntries } from "shared/lib/objects";
import { DEFAULT_TABLE_STATE } from "./constants";
import { ITableProps } from "./types";
import { getPageCount } from "./utils";
import { TablePagination } from "./_Pagination";
import { ErrorAlert } from "../alert";
import { TableHead } from "./Head";
import { TableBody } from "./Body";
import { TableFoot } from "./Foot";
import { useInternalColumns, useSyncTableState } from "./hooks";
import { cn } from "@/lib/utils";
import { Table as TableRoot } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "../skeleton/table";
import { ScrollArea } from "@/components/ui/scroll-area";

export { DEFAULT_TABLE_STATE };

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
    isPlaceholderData,
  } = tableData;

  const totalPageCount = getPageCount(data.totalRecords, data.pageSize);

  const dataLength = data.data.length;

  const internalColumns = useInternalColumns(columns);

  const tableDataStringified = React.useMemo(() => {
    return data.data.map((datum) =>
      Object.fromEntries(
        typescriptSafeObjectDotEntries(datum).map(([key, value]) => [
          key,
          // eslint-disable-next-line no-nested-ternary
          typeof value === "object"
            ? JSON.stringify(value)
            : typeof value === "number"
            ? `${value}`
            : value,
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

  const previousDataRender = isPlaceholderData && (
    <Skeleton className="h-[2px] bg-primary" />
  );

  return (
    <div className="w-full">
      <ScrollArea
        orientation="horizontal"
        className={cn("relative bg-base", {
          "min-h-[500px]": dataLength > 0 && !lean,
        })}
      >
        {previousDataRender}
        <TableRoot
          className={cn("w-full text-main border-collapse", {
            "border-border border-r border-l": border,
          })}
        >
          <TableHead table={table} />
          <TableBody
            table={table}
            dataLength={dataLength}
            empty={empty}
            isLoading={isLoading}
          />
          <TableFoot table={table} dataLength={dataLength} />
        </TableRoot>
        {previousDataRender}
      </ScrollArea>
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
    </div>
  );
}
