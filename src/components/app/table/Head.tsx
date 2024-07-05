import type { Table } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import * as React from "react";
import { ArrowUp } from "react-feather";
import type { TableFilterType } from "shared/types/data";

import {
  TableHead as TableHeadCmp,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { TableFilter } from "./filters";

interface IColumnMeta {
  filter?: TableFilterType;
}

interface IProps {
  table: Table<Record<string, unknown>>;
}

export function TableHead({ table }: IProps) {
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
                <div className="flex items-center justify-between gap-0">
                  <span className="font-semibold">
                    {header.isPlaceholder ? null : view}
                  </span>
                  <div className="flex w-auto items-center justify-end gap-0">
                    {header.column.getCanSort() && (
                      <ArrowUp
                        className={cn(
                          "ml-0 cursor-pointer text-muted opacity-70 transition-all",
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
