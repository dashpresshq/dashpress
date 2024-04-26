import { useLingui } from "@lingui/react";
import { Input } from "./Styles";
import { ISharedFormInput } from "./_types";
import { wrapLabelAndError, generateFormArias } from "./_wrapForm";

interface IFormNumberInput extends ISharedFormInput {
  allowNegative?: boolean;
}

const getNumberValue = (value: string | number | null, required: boolean) => {
  if (!required && !value) {
    return null;
  }
  if (value) {
    return +value;
  }
  return value;
};

export const FormNumberInput = (formInput: IFormNumberInput) => {
  const { input, placeholder, disabled, meta, allowNegative, required, sm } =
    formInput;
  if (typeof input.value === "string") {
    input.onChange(getNumberValue(input.value, !!required));
  }

  const { _ } = useLingui();

  const moreProps = { min: allowNegative ? Number.NEGATIVE_INFINITY : 0 };

  return wrapLabelAndError(
    <Input
      {...input}
      {...generateFormArias(meta)}
      {...moreProps}
      sm={sm}
      id={formInput.input.name}
      onChange={(e) => {
        input.onChange(getNumberValue(e.target.value, !!required));
      }}
      placeholder={_(placeholder)}
      type="number"
      disabled={disabled}
    />,
    formInput
  );
};
