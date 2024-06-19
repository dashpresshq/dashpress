import { IColumnFilterBag } from "shared/types/data";
import { BaseSyntheticEvent } from "react";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/macro";
import { IFilterProps } from "./types";
import { Input } from "@/components/ui/input";

export function FilterTableByText({
  column: { filterValue, setFilter },
}: IFilterProps<IColumnFilterBag<string>, undefined>) {
  const { _ } = useLingui();
  return (
    <Input
      value={filterValue?.value || ""}
      onChange={(e: BaseSyntheticEvent) => {
        setFilter({
          ...filterValue,
          value: e.target.value,
        });
      }}
      placeholder={_(msg`Search`)}
    />
  );
}
