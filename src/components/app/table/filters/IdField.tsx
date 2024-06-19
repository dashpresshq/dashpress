import { IColumnFilterBag } from "shared/types/data";
import { BaseSyntheticEvent } from "react";
import { IFilterProps } from "./types";
import { Input } from "@/components/ui/input";

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
