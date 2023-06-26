import React from "react";
import { FilterOperators, IColumnFilterBag } from "@hadmean/protozoa";
import { ISelectData } from "../../../types";
import { SimpleSelect } from "../../Form/FormSelect/Simple";
import { IFilterProps } from "./types";

export function FilterTableByBooleans({
  column: { filterValue, setFilter },
  bag,
}: IFilterProps<IColumnFilterBag<boolean>, ISelectData[]>) {
  return (
    <SimpleSelect
      options={[{ label: "-- Select State --", value: "" }, ...bag]}
      onChange={(value: string) => {
        setFilter({
          operator: FilterOperators.EQUAL_TO,
          value: value === "" ? undefined : value === "true",
        });
      }}
      fullWidth
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
