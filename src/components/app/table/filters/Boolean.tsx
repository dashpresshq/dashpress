import { FilterOperators, IColumnFilterBag } from "shared/types/data";
import { ISelectData } from "shared/types/options";
import { msg } from "@lingui/macro";
import { IFilterProps } from "./types";
import { Select } from "@/components/ui/select";

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
