import { IColumnFilterBag } from "shared/types/data";
import { ISelectData } from "shared/types/options";
import { IFilterProps } from "./types";
import { FormMultiSelect } from "@/frontend/design-system/components/Form/Select";

export function FilterTableByStatus({
  column: { filterValue, setFilter },
  bag,
}: IFilterProps<IColumnFilterBag<string[]>, ISelectData[]>) {
  return (
    <div className="min-w-64">
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
