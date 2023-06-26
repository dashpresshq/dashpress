import React from "react";
import { IColumnFilterBag } from "@hadmean/protozoa";
import { FormMultiSelect } from "../../Form/FormSelect";
import { IFilterProps } from "./types";
import { ISelectData } from "../../../types";

export function FilterTableByStatus({
  column: { filterValue, setFilter },
  bag,
}: IFilterProps<IColumnFilterBag<string[]>, ISelectData[]>) {
  return (
    <div style={{ minWidth: "250px" }}>
      <FormMultiSelect
        selectData={bag}
        values={filterValue?.value || []}
        onChange={(value) => {
          setFilter({
            ...filterValue,
            value,
          });
        }}
      />
    </div>
  );
}
