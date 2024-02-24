import React from "react";
import DatePicker from "react-datepicker";
import { FieldMetaState } from "react-final-form";
import styled from "styled-components";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { IInput, InputStyles } from "../Styles";
import { ISharedFormInput } from "../_types";
import { wrapLabelAndError, generateFormArias } from "../_wrapForm";
import { dateLibraryStyle } from "./defaultStyle";

interface IFormDateInput extends ISharedFormInput {
  minDate?: Date;
  maxDate?: Date;
}

const Root = styled.div<IInput>`
  ${dateLibraryStyle}
  .react-datepicker {
    border: 1px solid ${USE_ROOT_COLOR("border-color")};
  }
  input {
    ${InputStyles};
  }
  .react-datepicker__day--selected {
    background-color: ${USE_ROOT_COLOR("primary-color")};
  }
  .react-datepicker__header {
    border-bottom: 1px solid ${USE_ROOT_COLOR("border-color")};
  }
  .react-datepicker__close-icon::after {
    background-color: ${USE_ROOT_COLOR("primary-color")};
  }
  .react-datepicker__header {
    background-color: ${USE_ROOT_COLOR("soft-color")};
  }
  .react-datepicker__current-month,
  .react-datepicker__day-name {
    color: ${USE_ROOT_COLOR("main-text")};
  }
`;

interface IProps {
  minDate?: Date;
  maxDate?: Date;
  onChange: (value: Date | null) => void;
  value: Date;
  id?: string;
  isClearable?: boolean;
  disabled?: boolean;
  className?: string;
  meta?: FieldMetaState<any>;
}

export function ControlledFormDateInput({
  minDate,
  maxDate,
  onChange,
  value,
  isClearable,
  id,
  disabled,
  className,
  meta,
}: IProps) {
  return (
    <Root>
      <DatePicker
        onChange={(value$1) => {
          onChange(value$1);
        }}
        {...generateFormArias(meta)}
        showTwoColumnMonthYearPicker
        isClearable={isClearable}
        selected={value}
        id={id}
        minDate={minDate}
        maxDate={maxDate}
        className={className}
        disabled={disabled}
      />
    </Root>
  );
}

export const FormDateInput: React.FC<IFormDateInput> = (formInput) => {
  const { input, disabled, meta, required, minDate, maxDate } = formInput;
  let { value } = input;
  if (value && typeof value === "string") {
    value = new Date(value);
    input.onChange(value);
  }
  return wrapLabelAndError(
    <ControlledFormDateInput
      onChange={(value$1) => {
        input.onChange(value$1);
      }}
      isClearable={!required}
      value={value}
      id={formInput.input.name}
      minDate={minDate}
      maxDate={maxDate}
      meta={meta}
      disabled={disabled}
    />,
    formInput
  );
};
