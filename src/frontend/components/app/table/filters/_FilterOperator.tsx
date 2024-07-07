import { msg } from "@lingui/macro";
import { useEffect } from "react";

import { Select } from "@/components/ui/select";
import type { FilterOperators, IColumnFilterBag } from "@/shared/types/data";

import { FILTER_OPERATOR_CONFIG } from "./constants";

interface IProps<T> {
  operators: FilterOperators[];
  filterValue: IColumnFilterBag<T> | undefined;
  setFilter: (value: IColumnFilterBag<T> | undefined) => void;
}

export function RenderFilterOperator<T>({
  operators,
  filterValue,
  setFilter,
}: IProps<T>) {
  useEffect(() => {
    if (!filterValue?.operator && filterValue?.value) {
      setFilter({
        ...filterValue,
        operator: operators[0],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filterValue)]);

  return (
    <Select
      placeholder={msg`Select Operator`}
      name="filter-operator"
      className="w-full"
      options={[
        ...operators.map((operator) => ({
          value: operator,
          label: FILTER_OPERATOR_CONFIG[operator].label,
        })),
      ]}
      onChange={(value) => {
        setFilter({
          ...filterValue,
          operator: value as FilterOperators,
        });
      }}
      value={filterValue?.operator || ""}
    />
  );
}
