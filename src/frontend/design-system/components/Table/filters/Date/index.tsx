import { Spacer } from "frontend/design-system/primitives/Spacer";
import { DATE_FILTER_VALUE, IColumnFilterBag } from "shared/types/data";
import { useToggle } from "frontend/hooks/state/useToggleState";
import { msg } from "@lingui/macro";
import { DATE_FILTER_OPTIONS } from "./constants";
import { IFilterProps } from "../types";
import { DateSelection } from "./_Selection";
import { FormSwitch } from "../../../Form/Switch";
import { ControlledFormDateInput } from "../../../Form/Date";

export function FilterTableByDate({
  column: { filterValue, setFilter },
}: IFilterProps<IColumnFilterBag<string>, undefined>) {
  const customDateMode = useToggle();

  return (
    <>
      <FormSwitch
        name="custom_date"
        onChange={(newFormat) => {
          customDateMode.set(newFormat);
          if (!newFormat) {
            setFilter({
              ...filterValue,
              value: DATE_FILTER_VALUE.BEGINNING_OF_TIME_VALUE,
              value2: DATE_FILTER_VALUE.NOW,
            });
          } else {
            setFilter({
              ...filterValue,
              value: new Date().toDateString(),
              value2: new Date().toDateString(),
            });
          }
        }}
        value={customDateMode.isOn}
        size="sm"
        label={msg`Custom Date`}
      />
      {new Date(filterValue?.value || "").toString() !== "Invalid Date" ? (
        <>
          <ControlledFormDateInput
            onChange={(value) => {
              setFilter({
                ...filterValue,
                value: new Date(value || "").toDateString(),
              });
            }}
            value={new Date(filterValue?.value || "")}
          />
          <Spacer />
          <ControlledFormDateInput
            onChange={(value) => {
              setFilter({
                ...filterValue,
                value2: new Date(value || "").toDateString(),
              });
            }}
            value={new Date(filterValue?.value2 || "")}
          />
        </>
      ) : (
        <>
          <DateSelection
            setFilter={setFilter}
            filterValue={filterValue}
            field="value"
            defaultValue={DATE_FILTER_VALUE.BEGINNING_OF_TIME_VALUE}
            dateOptions={DATE_FILTER_OPTIONS.filter(
              ({ hideOnFrom }) => !hideOnFrom
            )}
          />
          <Spacer />
          <DateSelection
            setFilter={setFilter}
            filterValue={filterValue}
            field="value2"
            defaultValue={DATE_FILTER_VALUE.NOW}
            dateOptions={DATE_FILTER_OPTIONS.filter(
              ({ hideOnTo }) => !hideOnTo
            )}
          />
        </>
      )}
    </>
  );
}
