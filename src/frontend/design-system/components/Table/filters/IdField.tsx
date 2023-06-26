import React from "react";
import { IColumnFilterBag } from "@hadmean/protozoa";
import { StyledInput } from "../../Form/Styles";
import { IFilterProps } from "./types";

export function FilterTableByIdField({
  column: { filterValue, setFilter },
}: IFilterProps<IColumnFilterBag<string>, undefined>) {
  return (
    <StyledInput
      value={filterValue?.value || ""}
      onChange={(e: React.BaseSyntheticEvent) => {
        setFilter({
          ...filterValue,
          value: e.target.value || undefined,
        });
      }}
      placeholder="Enter value"
    />
  );
}
