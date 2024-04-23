import Select from "react-select";
import styled from "styled-components";
import { ISelectData } from "shared/types/options";
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
  return (
    <SelectStyled
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
      aria-label={ariaLabel}
      options={selectData}
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
  const selectDataWithDefault = [
    {
      value: nullable ? null : "",
      label: defaultLabel || `--- Select ${formLabel} ---`,
    },
    ...selectData,
  ] as ISelectData[];
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
        placeholder={placeholder}
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
  defaultLabel?: string;
}

export function FormNoValueSelect({
  selectData,
  disabledOptions,
  defaultLabel,
  onChange,
}: IFormNoValueSelect) {
  return (
    <SelectStyled
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
