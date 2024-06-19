import DatePicker from "react-datepicker";
import { FieldMetaState } from "react-final-form";
import styled, { css } from "styled-components";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";

import { ISharedFormInput } from "../../../../../components/app/form/input/types";
import { dateLibraryStyle } from "./defaultStyle";
import { SYSTEM_COLORS } from "@/frontend/design-system/theme/system";
import {
  LabelAndError,
  generateFormArias,
} from "@/components/app/form/input/label-and-error";

export const InputStyles = css`
  margin: 0;
  overflow: visible;
  display: block;
  width: 100%;
  height: calc(1.8em + 0.75rem + 2px);
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1.8;
  color: ${USE_ROOT_COLOR("main-text")};
  background-color: ${USE_ROOT_COLOR("base-color")};
  background-clip: padding-box;
  border-radius: 6px;

  transition: border-color 0.15s ease-in-out;

  &:focus {
    border-width: 1.5px;
    color: ${USE_ROOT_COLOR("main-text")};
    background-color: ${USE_ROOT_COLOR("base-color")};
    border-color: ${USE_ROOT_COLOR("primary-color")};
    outline: 0;
  }

  &[aria-invalid] {
    border-width: 1px;
    border-color: ${SYSTEM_COLORS.danger} !important;
  }

  &::-ms-expand {
    background-color: transparent;
    border: 0;
  }

  &:-moz-focusring {
    color: transparent;
    text-shadow: 0 0 0 ${USE_ROOT_COLOR("main-text")};
  }

  &:disabled {
    background-color: ${USE_ROOT_COLOR("soft-color")};
    opacity: 1;
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

interface IFormDateInput extends ISharedFormInput {
  minDate?: Date;
  maxDate?: Date;
}

const Root = styled.div`
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

export function FormDateInput(formInput: IFormDateInput) {
  const { input, disabled, meta, required, minDate, maxDate } = formInput;
  let { value } = input;
  if (value && typeof value === "string") {
    value = new Date(value);
    input.onChange(value);
  }
  return (
    <LabelAndError formInput={formInput}>
      <ControlledFormDateInput
        onChange={(value$1) => {
          input.onChange(value$1);
        }}
        isClearable={!required}
        value={value}
        id={input.name}
        minDate={minDate}
        maxDate={maxDate}
        meta={meta}
        disabled={disabled}
      />
    </LabelAndError>
  );
}
