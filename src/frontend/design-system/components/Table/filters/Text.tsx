import React from "react";
import { IColumnFilterBag } from "shared/types/data";
import { Input } from "../../Form/Styles";
import { IFilterProps } from "./types";

export function FilterTableByText({
  column: { filterValue, setFilter },
}: IFilterProps<IColumnFilterBag<string>, undefined>) {
  return (
    <Input
      value={filterValue?.value || ""}
      onChange={(e: React.BaseSyntheticEvent) => {
        setFilter({
          ...filterValue,
          value: e.target.value || undefined,
        });
      }}
      placeholder="Search"
    />
  );
}
