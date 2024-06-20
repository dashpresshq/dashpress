import Select from "react-select";
import styled from "styled-components";
import { ISelectData } from "shared/types/options";
import { useLingui } from "@lingui/react";
import { useMemo } from "react";
import { SelectStyles, SharedSelectProps } from "./styles";

export const SelectStyled = styled(Select)`
  ${SelectStyles}
`;

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
    <SelectStyled
      classNamePrefix={SharedSelectProps.classNamePrefix}
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
