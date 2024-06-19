import { flexRender, Table } from "@tanstack/react-table";
import {
  TableCell,
  TableRow,
  TableBody as TableBodyRoot,
} from "@/components/ui/table";
import { IEmptyWrapperProps } from "../empty-wrapper/types";
import { EmptyWrapper } from "../empty-wrapper";

// const BodyTR = styled.tr<{ $hoverColor: string }>`
//   .show-on-hover {
//     opacity: 0;
//   }
//   &:hover {
//     .show-on-hover {
//       opacity: 1;
//     }
//   }
// `;

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
        <TableRow key={row.id}>
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
              <div style={{ height: "204px" }} />
            ) : (
              <EmptyWrapper {...{ ...empty }} />
            )}
          </TableCell>
        </TableRow>
      ) : null}
    </TableBodyRoot>
  );
}
