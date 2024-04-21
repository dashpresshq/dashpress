import { IColumnFilterBag } from "shared/types/data";
import { BaseSyntheticEvent } from "react";
import { Input } from "../../Form/Styles";
import { IFilterProps } from "./types";

export function FilterTableByText({
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
      placeholder="Search"
    />
  );
}
