import type { BaseSyntheticEvent } from "react";
import type { IColumnFilterBag } from "shared/types/data";

import { Input } from "@/components/ui/input";

import type { IFilterProps } from "./types";

export function FilterTableByIdField({
  column: { filterValue, setFilter },
}: IFilterProps<IColumnFilterBag<string>, undefined>) {
  return (
    <Input
      value={filterValue?.value || ""}
      onChange={(e: BaseSyntheticEvent) => {
        setFilter({
          ...filterValue,
          value: e.target.value,
        });
      }}
      placeholder="Enter value"
    />
  );
}
