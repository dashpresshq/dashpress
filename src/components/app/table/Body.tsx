import type { Table } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import {
  TableCell,
  TableRow,
  TableBody as TableBodyRoot,
} from "@/components/ui/table";
import type { IEmptyWrapperProps } from "../empty-wrapper/types";
import { EmptyWrapper } from "../empty-wrapper";

interface IProps {
  table: Table<Record<string, unknown>>;
  dataLength: number;
  isLoading: boolean;
  empty: IEmptyWrapperProps;
}

export function TableBody({ table, dataLength, empty, isLoading }: IProps) {
  return (
    <TableBodyRoot>
      {table.getRowModel().rows.map((row) => (
        <TableRow
          key={row.id}
          className="[&_.show-on-hover]:opacity-0 [&_.show-on-hover]:hover:opacity-100"
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
      {dataLength === 0 ? (
        <TableRow>
          <TableCell colSpan={10000}>
            {isLoading ? (
              <div className="h-52" />
            ) : (
              <EmptyWrapper {...{ ...empty }} />
            )}
          </TableCell>
        </TableRow>
      ) : null}
    </TableBodyRoot>
  );
}
