import React from "react";
import { Input } from "./Styles";
import { ISharedFormInput } from "./_types";
import { wrapLabelAndError, generateFormArias } from "./_wrapForm";

interface IFormInput extends ISharedFormInput {
  type?: "email" | "password" | "url" | "color";
}

export const FormInput: React.FC<IFormInput> = (formInput) => {
  const { input, type, disabled, meta, placeholder, ...rest } = formInput;

  return wrapLabelAndError(
    <Input
      {...input}
      {...rest}
      {...generateFormArias(meta)}
      type={type}
      id={formInput.input.name}
      placeholder={placeholder}
      disabled={disabled}
    />,
    formInput
  );
};
