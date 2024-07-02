import { flexRender, Table } from "@tanstack/react-table";
import * as React from "react";
import { ArrowUp } from "react-feather";
import { TableFilterType } from "shared/types/data";
import { TableFilter } from "./filters";
import {
  TableHeader,
  TableRow,
  TableHead as TableHeadCmp,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface IColumnMeta {
  filter?: TableFilterType;
}

interface IProps {
  table: Table<Record<string, unknown>>;
}

export function _TableHead({ table }: IProps) {
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const view = flexRender(
              header.column.columnDef.header,
              header.getContext()
            );
            const { filter } = header.column.columnDef.meta as IColumnMeta;
            const isSorted = header.column.getIsSorted();
            return (
              <TableHeadCmp
                key={header.id}
                className={cn({ "cursor-pointer": header.column.getCanSort() })}
                onClick={header.column.getToggleSortingHandler()}
              >
                <div className="flex justify-between items-center gap-0">
                  <span className="font-semibold">
                    {header.isPlaceholder ? null : view}
                  </span>
                  <div className="flex justify-end w-auto items-center gap-0">
                    {header.column.getCanSort() && (
                      <ArrowUp
                        className={cn(
                          "text-muted opacity-70 cursor-pointer ml-0 transition-all",
                          {
                            "rotate-180": isSorted === "desc",
                            "opacity-100 text-primary": !!isSorted,
                          }
                        )}
                        size={18}
                        aria-label={`Sort By ${view} ${
                          // eslint-disable-next-line no-nested-ternary
                          isSorted ? (isSorted === "desc" ? "Desc" : "Asc") : ""
                        }`}
                      />
                    )}
                    {header.column.getCanFilter() && filter ? (
                      <TableFilter
                        view={view}
                        column={header.column}
                        type={filter}
                      />
                    ) : null}
                  </div>
                </div>
              </TableHeadCmp>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}

export const TableHead = React.memo(_TableHead);
