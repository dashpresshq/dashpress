import React from "react";
import { IColumnFilterBag } from "shared/types/data";
import { ISelectData } from "shared/types/options";
import { FormMultiSelect } from "../../Form/FormSelect";
import { IFilterProps } from "./types";

export function FilterTableByStatus({
  column: { filterValue, setFilter },
  bag,
}: IFilterProps<IColumnFilterBag<string[]>, ISelectData[]>) {
  return (
    <div style={{ minWidth: "250px" }}>
      <FormMultiSelect
        selectData={bag}
        values={filterValue?.value || []}
        ariaLabel="Select Status"
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
