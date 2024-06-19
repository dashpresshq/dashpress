import { IColumnFilterBag } from "shared/types/data";
import { IFilterProps } from "./types";
import { AsyncFormMultiSelect } from "@/frontend/design-system/components/Form/Select/Async";

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
