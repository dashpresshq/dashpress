import type { Column } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";

import { cn } from "@/components/utils";
import { typescriptSafeObjectDotEntries } from "@/shared/lib/objects";
import type { IColumnFilterBag, TableFilterType } from "@/shared/types/data";

import { RenderFilterOperator } from "./_FilterOperator";
import { FilterWrapper } from "./_FilterWrapper";
import { FilterTypesConfigBag } from "./config";

const FILTER_DEBOUNCE_WAIT = 500;

interface IProps {
  type: TableFilterType;
  column: Pick<
    Column<Record<string, unknown>, unknown>,
    "setFilterValue" | "getFilterValue"
  >;
  view?: ReactNode | string;
  debounceWait?: number;
}

export function TableFilter({
  type,
  column,
  view,
  debounceWait = FILTER_DEBOUNCE_WAIT,
}: IProps) {
  const filterValue = column.getFilterValue() as IColumnFilterBag<any>;

  const setFilter = (value?: IColumnFilterBag<unknown>) => {
    if (value === undefined) {
      column.setFilterValue(undefined);
      return;
    }

    return column.setFilterValue(
      Object.fromEntries(
        typescriptSafeObjectDotEntries(value).filter(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([_, value$1]) => value$1 || typeof value$1 === "boolean"
        )
      )
    );
  };

  const { filterHasValueImpl, operators, FilterComponent } =
    FilterTypesConfigBag[type._type];

  const [localValue, setLocalValue] = useState<
    IColumnFilterBag<any> | undefined
  >(filterValue);

  useEffect(() => {
    setLocalValue(filterValue);
  }, [filterValue]);

  useDebounce(
    () => {
      setFilter(localValue);
    },
    debounceWait,
    [localValue]
  );

  return (
    <FilterWrapper
      filterHasValue={filterHasValueImpl(filterValue)}
      clearFilter={setFilter}
      columnLabel={view}
      filterType={type._type}
    >
      {operators.length > 0 && (
        <div
          className={cn({
            hidden: operators.length === 1,
            block: operators.length > 1,
          })}
        >
          <RenderFilterOperator
            operators={operators}
            filterValue={filterValue}
            setFilter={setFilter}
          />
        </div>
      )}
      <FilterComponent
        column={{
          filterValue: localValue,
          setFilter: (value) => setLocalValue(value),
        }}
        bag={type.bag}
      />
    </FilterWrapper>
  );
}
