import { useLingui } from "@lingui/react";
import { ISharedFormInput } from "./_types";
import { generateFormArias, wrapLabelAndError } from "./_wrapForm";
import { Input } from "./Styles";

interface IFormInput extends ISharedFormInput {
  type?: "password" | "text";
}

export const FormPasswordInput = (formInput: IFormInput) => {
  const { input, type, disabled, meta, placeholder, ...rest } = formInput;
  const { _ } = useLingui();
  return wrapLabelAndError(
    <Input
      {...input}
      {...rest}
      {...generateFormArias(meta)}
      type={type}
      id={formInput.input.name}
      placeholder={placeholder ? _(placeholder) : null}
      disabled={disabled}
    />,
    formInput
  );
};
