import { msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import type { IColumnFilterBag } from "shared/types/data";
import type { ISelectData } from "shared/types/options";

import { Select } from "@/components/ui/select";

import { MultiFilterValues } from "./_MultiFilterValues";
import type { IFilterProps } from "./types";

export function FilterTableByStatus({
  column: { filterValue, setFilter },
  bag,
}: IFilterProps<IColumnFilterBag<string[]>, ISelectData[]>) {
  const values = filterValue?.value || [];
  const { _ } = useLingui();
  return (
    <div>
      <MultiFilterValues
        filterValue={filterValue}
        setFilter={setFilter}
        values={values}
        options={bag.map(({ label, value }) => ({
          value: String(value),
          label: _(label),
        }))}
      />
      <Select
        onChange={(value) => {
          setFilter({
            ...filterValue,
            value: [...new Set([...values, value])],
          });
        }}
        name="select-filter"
        value=""
        options={bag}
        disabledOptions={values}
        placeholder={msg`Select Option`}
      />
    </div>
  );
}
