import Select from "react-select";
import styled from "styled-components";
import { ISelectData } from "shared/types/options";
import { useLingui } from "@lingui/react";
import { useMemo } from "react";
import { msg } from "@lingui/macro";
import { SelectStyles, SharedSelectProps } from "./styles";
import { IBaseFormSelect } from "./types";
import { Select as SelectCmp } from "@/components/ui/select"; // TODO
import { fakeMessageDescriptor } from "@/translations/fake";
import {
  LabelAndError,
  generateClassNames,
  generateFormArias,
} from "@/components/app/form/input/label-and-error";

interface IFormSelect extends IBaseFormSelect {
  selectData: ISelectData[];
}

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

export function FormSelect(formInput: IFormSelect) {
  const {
    input,
    selectData,
    meta,
    disabled,
    label: formLabel,
    disabledOptions,
    placeholder,
  } = formInput;
  const { _ } = useLingui();

  return (
    <LabelAndError formInput={formInput}>
      <SelectCmp
        {...input}
        {...generateFormArias(meta)}
        className={generateClassNames(meta)}
        options={selectData}
        placeholder={
          placeholder ||
          fakeMessageDescriptor(`--- ${_(msg`Select ${_(formLabel)}`)} ---`)
        }
        disabled={disabled}
        disabledOptions={disabledOptions}
      />
    </LabelAndError>
  );
}
