import { flexRender, Table } from "@tanstack/react-table";
import { TableFooter, TableHead, TableRow } from "@/components/ui/table";

const SHOW_FOOTER_THRESHOLD = 20;

interface IProps {
  table: Table<Record<string, unknown>>;
  dataLength: number;
}

export function TableFoot({ table, dataLength }: IProps) {
  if (dataLength < SHOW_FOOTER_THRESHOLD) {
    return null;
  }
  return (
    <TableFooter>
      {table.getFooterGroups().map((footerGroup) => (
        <TableRow key={footerGroup.id} className="hover:bg-base">
          {footerGroup.headers.map((header) => (
            <TableHead key={header.id}>
              <span className="text-sm font-semibold">
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
              </span>
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableFooter>
  );
}
