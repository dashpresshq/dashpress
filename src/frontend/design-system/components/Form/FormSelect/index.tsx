import React from "react";
import Select from "react-select";
import styled from "styled-components";
import {
  generateClassNames,
  wrapLabelAndError,
  generateFormArias,
} from "../_wrapForm";
import { ISelectData } from "../../../types";
import { SelectStyles, SharedSelectProps } from "./styles";
import { IBaseFormSelect } from "./types";

interface IFormSelect extends IBaseFormSelect {
  selectData: ISelectData[];
}

export const StyledSelect = styled(Select)`
  ${SelectStyles}
`;

interface IFormMultiSelect {
  selectData: ISelectData[];
  values: string[];
  onChange: (values: string[]) => void;
}

export function FormMultiSelect({
  selectData,
  values = [],
  onChange,
}: IFormMultiSelect) {
  return (
    <StyledSelect
      classNamePrefix={SharedSelectProps.classNamePrefix}
      closeMenuOnSelect={false}
      defaultValue={[]}
      isMulti
      value={values.map((value) =>
        selectData.find((selectDatum) => selectDatum.value === value)
      )}
      onChange={(newValues: any) => {
        onChange(newValues.map(({ value }: ISelectData) => value));
      }}
      options={selectData}
    />
  );
}

export const FormSelect: React.FC<IFormSelect> = (props) => {
  const {
    input,
    selectData,
    meta,
    disabled,
    label: formLabel,
    disabledOptions,
    nullable,
    defaultLabel,
  } = props;
  const selectDataWithDefault = [
    {
      value: nullable ? null : "",
      label: defaultLabel || `--- Select ${formLabel} ---`,
    },
    ...selectData,
  ] as ISelectData[];
  return wrapLabelAndError(
    <StyledSelect
      {...input}
      {...generateFormArias(meta)}
      classNamePrefix={SharedSelectProps.classNamePrefix}
      value={
        selectDataWithDefault.find(({ value }) => value === input.value) || {
          value: "",
          label: "",
        }
      }
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
    />,
    props
  );
};

interface IFormNoValueSelect {
  selectData: ISelectData[];
  disabledOptions: string[];
  onChange: (value: string, label?: string) => void;
  defaultLabel?: string;
}

export function FormNoValueSelect({
  selectData,
  disabledOptions,
  defaultLabel,
  onChange,
}: IFormNoValueSelect) {
  return (
    <StyledSelect
      classNamePrefix={SharedSelectProps.classNamePrefix}
      value={{ value: "", label: defaultLabel || "" }}
      onChange={({ value, label }: any) => {
        onChange(value, label);
      }}
      options={
        selectData.filter(
          ({ value }) => !disabledOptions.includes(value as string)
        ) as { value: string; label: string }[]
      }
    />
  );
}
