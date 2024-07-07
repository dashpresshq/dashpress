import { msg } from "@lingui/macro";

import { Select } from "@/components/ui/select";
import type { IColumnFilterBag } from "@/shared/types/data";
import { FilterOperators } from "@/shared/types/data";
import type { ISelectData } from "@/shared/types/options";

import type { IFilterProps } from "./types";

export function FilterTableByBooleans({
  column: { filterValue, setFilter },
  bag,
}: IFilterProps<IColumnFilterBag<boolean>, ISelectData[]>) {
  return (
    <Select
      placeholder={msg`Select Value`}
      name="filter-operator"
      className="w-full"
      options={bag}
      onChange={(value: string) => {
        setFilter({
          operator: FilterOperators.EQUAL_TO,
          value: value === "" ? undefined : value === "true",
        });
      }}
      value={
        // eslint-disable-next-line no-nested-ternary
        filterValue?.value === undefined
          ? ""
          : filterValue?.value
          ? "true"
          : "false"
      }
    />
  );
}
