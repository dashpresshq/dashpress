import React from "react";
import { IColumnFilterBag } from "shared/types/data";
import { IFilterProps } from "./types";

import { AsyncFormMultiSelect } from "../../Form/FormSelect/Async";

export function FilterTableByListSelection({
  column: { filterValue, setFilter },
  bag,
}: IFilterProps<IColumnFilterBag<string[]>, string>) {
  return (
    <div style={{ minWidth: "250px" }}>
      <AsyncFormMultiSelect
        url={bag}
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
