import type { ReactElement } from "react";
import type { IColumnFilterBag, TableFilterType } from "shared/types/data";
import { FilterOperators } from "shared/types/data";
import type { IFilterProps } from "./types";
import { FilterTableByListSelection } from "./List";
import { FilterTableByStatus } from "./Status";
import { FilterTableByIdField } from "./IdField";
import { FilterTableByBooleans } from "./Boolean";
import { FilterTableByText } from "./Text";
import { FilterTableByNumbers } from "./Number";
import { FilterTableByDate } from "./Date";

type FilterHasValueImplFnType = (filterValue: IColumnFilterBag<any>) => boolean;
type FilterComponentFnType = (
  props: IFilterProps<IColumnFilterBag<any>, any>
) => ReactElement;

export const FilterTypesConfigBag: Record<
  TableFilterType["_type"],
  {
    operators: FilterOperators[];
    FilterComponent: FilterComponentFnType;
    filterHasValueImpl: FilterHasValueImplFnType;
  }
> = {
  string: {
    operators: [
      FilterOperators.CONTAINS,
      FilterOperators.EQUAL_TO,
      FilterOperators.NOT_EQUAL,
    ],
    FilterComponent: FilterTableByText,
    filterHasValueImpl: (filterValue) => filterValue?.value !== undefined,
  },
  number: {
    operators: [
      FilterOperators.EQUAL_TO,
      FilterOperators.NOT_EQUAL,
      FilterOperators.BETWEEN,
      FilterOperators.GREATER_THAN,
      FilterOperators.LESS_THAN,
    ],
    FilterComponent: FilterTableByNumbers,
    filterHasValueImpl: (filterValue) => filterValue?.value !== undefined,
  },
  list: {
    operators: [FilterOperators.IN, FilterOperators.NOT_IN],
    FilterComponent: FilterTableByListSelection,
    filterHasValueImpl: (filterValue: IColumnFilterBag<string[]>) =>
      filterValue?.value !== undefined && (filterValue?.value.length || 0) > 0,
  },
  status: {
    operators: [FilterOperators.IN, FilterOperators.NOT_IN],
    FilterComponent: FilterTableByStatus,
    filterHasValueImpl: (filterValue: IColumnFilterBag<string[]>) =>
      filterValue?.value !== undefined,
  },
  boolean: {
    operators: [],
    FilterComponent: FilterTableByBooleans,
    filterHasValueImpl: (filterValue: IColumnFilterBag<boolean[]>) =>
      filterValue?.value !== undefined,
  },
  idField: {
    operators: [FilterOperators.EQUAL_TO],
    FilterComponent: FilterTableByIdField,
    filterHasValueImpl: (filterValue: IColumnFilterBag<string>) =>
      filterValue?.value !== undefined,
  },
  date: {
    operators: [FilterOperators.DATE],
    FilterComponent: FilterTableByDate,
    filterHasValueImpl: (filterValue: IColumnFilterBag<string>) =>
      filterValue?.value !== undefined || filterValue?.value2 !== undefined,
  },
};
