import { useEffect } from "react";
import { FilterOperators, IColumnFilterBag } from "shared/types/data";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { SimpleSelect } from "../../Form/FormSelect/Simple";
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
  }, [JSON.stringify(filterValue)]);
  return (
    <>
      <SimpleSelect
        options={[
          ...operators.map((operator) => ({
            value: operator,
            label: FILTER_OPERATOR_CONFIG[operator].label,
          })),
        ]}
        ariaLabel="Select Filter Operator"
        fullWidth
        width={0}
        onChange={(value) => {
          setFilter({
            ...filterValue,
            operator: value as FilterOperators,
          });
        }}
        value={filterValue?.operator || ""}
      />
      <Spacer />
    </>
  );
}
