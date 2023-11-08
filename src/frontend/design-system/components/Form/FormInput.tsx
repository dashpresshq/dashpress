import React from "react";
import { Input } from "./Styles";
import { ISharedFormInput } from "./_types";
import { wrapLabelAndError, generateFormArias } from "./_wrapForm";

interface IFormInput extends ISharedFormInput {
  type?: "email" | "password" | "url" | "color";
}

export const FormInput: React.FC<IFormInput> = (formInput) => {
  const { input, type, label, disabled, meta, ...rest } = formInput;

  return wrapLabelAndError(
    <Input
      {...input}
      {...rest}
      {...generateFormArias(meta)}
      type={type}
      id={formInput.input.name}
      placeholder={label}
      disabled={disabled}
    />,
    formInput
  );
};
