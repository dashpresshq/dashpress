import Select from "react-select";
import { ISelectData } from "shared/types/options";
import { useLingui } from "@lingui/react";
import { useMemo } from "react";

interface IFormMultiSelect {
  selectData: ISelectData[];
  values: string[];
  onChange: (values: string[]) => void;
  ariaLabel?: string;
}

export function FormMultiSelect({
  selectData,
  values = [],
  onChange,
  ariaLabel,
}: IFormMultiSelect) {
  const { _ } = useLingui();

  const allOptions = useMemo(
    () =>
      selectData.map(({ value, label }) => ({
        value,
        label: _(label),
      })),
    [selectData, _]
  );

  return (
    <Select
      closeMenuOnSelect={false}
      defaultValue={[]}
      isMulti
      value={values.map((value) =>
        allOptions.find((selectDatum) => selectDatum.value === value)
      )}
      onChange={(newValues: any) => {
        onChange(newValues.map(({ value }: ISelectData) => value));
      }}
      aria-label={ariaLabel}
      options={allOptions}
    />
  );
}
