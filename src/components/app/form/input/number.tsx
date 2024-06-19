import { ChangeEvent, useEffect } from "react";
import { ISharedFormInput } from "./types";
import { FormInput } from "./text";

interface IFormNumberInput extends ISharedFormInput {
  allowNegative?: boolean;
}

const getNumberValue = (value: string | number | null, required: boolean) => {
  if (!required && !value) {
    return null;
  }
  return Number(value);
};

export function FormNumberInput(formInput: IFormNumberInput) {
  const { input, allowNegative, required } = formInput;

  useEffect(() => {
    if (typeof input.value === "string") {
      input.onChange(getNumberValue(input.value, !!required));
    }
  }, [typeof input.value]);

  const moreProps = { min: allowNegative ? Number.NEGATIVE_INFINITY : 0 };

  const inputProps = {
    ...input,
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      input.onChange(getNumberValue(e.target.value, !!required));
    },
  };

  return (
    <FormInput {...formInput} input={inputProps} {...moreProps} type="number" />
  );
}
