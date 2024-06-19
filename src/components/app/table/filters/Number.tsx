import { FilterOperators, IColumnFilterBag } from "shared/types/data";
import { IFilterProps } from "./types";
import { Input } from "@/components/ui/input";

export function FilterTableByNumbers({
  column: { filterValue, setFilter },
}: IFilterProps<IColumnFilterBag<number>, undefined>) {
  return (
    <>
      <Input
        type="number"
        value={filterValue?.value || ""}
        onChange={(e) =>
          setFilter({
            ...filterValue,
            value: +e.target.value,
          })
        }
        aria-label="Value 1"
      />
      {filterValue?.operator === FilterOperators.BETWEEN && (
        <Input
          type="number"
          value={filterValue?.value2 || ""}
          onChange={(e) =>
            setFilter({
              ...filterValue,
              value2: +e.target.value,
            })
          }
          aria-label="Value 2"
        />
      )}
    </>
  );
}
