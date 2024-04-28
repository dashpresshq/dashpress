import Select from "react-select";
import styled from "styled-components";
import { ILabelValue, ISelectData } from "shared/types/options";
import { useLingui } from "@lingui/react";
import { MessageDescriptor } from "@lingui/core";
import { useMemo } from "react";
import {
  generateClassNames,
  wrapLabelAndError,
  generateFormArias,
} from "../_wrapForm";
import { SelectStyles, SharedSelectProps } from "./styles";
import { IBaseFormSelect } from "./types";

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

export const FormSelect = (props: IFormSelect) => {
  const {
    input,
    selectData,
    meta,
    disabled,
    label: formLabel,
    disabledOptions,
    nullable,
    defaultLabel,
    placeholder,
  } = props;
  const { _ } = useLingui();

  const selectDataWithDefault = [
    {
      value: nullable ? null : "",
      label: defaultLabel || `--- Select ${_(formLabel)} ---`,
    },
    ...selectData.map(({ value, label }) => ({ value, label: _(label) })),
  ];
  return wrapLabelAndError(
    <div data-testid={`react-select__${input.name}`}>
      <SelectStyled
        {...input}
        {...generateFormArias(meta)}
        classNamePrefix={SharedSelectProps.classNamePrefix}
        value={
          selectDataWithDefault.find(({ value }) => value === input.value) || {
            value: "",
            label: "",
          }
        }
        placeholder={placeholder ? _(placeholder) : null}
        inputId={input.name}
        onChange={({ value }: any) => {
          input.onChange(nullable && !value ? null : value);
        }}
        className={generateClassNames(meta)}
        isDisabled={disabled}
        options={selectDataWithDefault}
        isOptionDisabled={(option: unknown) => {
          if (!disabledOptions) {
            return false;
          }
          return disabledOptions.includes(
            (option as ISelectData).value as string
          );
        }}
      />
    </div>,
    props
  );
};

interface IFormNoValueSelect {
  selectData: ISelectData[];
  disabledOptions: string[];
  onChange: (value: string, label?: string) => void;
  defaultLabel?: MessageDescriptor;
}

export function FormNoValueSelect({
  selectData,
  disabledOptions,
  defaultLabel,
  onChange,
}: IFormNoValueSelect) {
  const { _ } = useLingui();
  return (
    <SelectStyled
      classNamePrefix={SharedSelectProps.classNamePrefix}
      value={{ value: "", label: defaultLabel ? _(defaultLabel) : "" }}
      onChange={({ value, label }: ILabelValue) => {
        onChange(value, label);
      }}
      options={selectData
        .filter(({ value }) => !disabledOptions.includes(value as string))
        .map(({ value, label }) => ({ value, label: _(label) }))}
    />
  );
}
