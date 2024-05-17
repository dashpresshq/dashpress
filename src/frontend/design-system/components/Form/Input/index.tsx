import { useLingui } from "@lingui/react";
import { Input } from "../Styles";
import { LabelAndError, generateFormArias } from "../LabelAndError";
import { ISharedFormInput } from "../types";

interface IFormInput extends ISharedFormInput {
  type?: "email" | "password" | "url" | "color" | "number";
}

export function FormInput(formInput: IFormInput) {
  const { input, type, disabled, meta, placeholder, required } = formInput;
  const { _ } = useLingui();
  return (
    <LabelAndError formInput={formInput}>
      <Input
        {...input}
        {...generateFormArias(meta)}
        required={required}
        type={type}
        id={input.name}
        placeholder={placeholder ? _(placeholder) : null}
        disabled={disabled}
      />
    </LabelAndError>
  );
}
