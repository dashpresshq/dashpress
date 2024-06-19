import { useLingui } from "@lingui/react";
import {
  generateClassNames,
  generateFormArias,
  LabelAndError,
} from "./label-and-error";
import { Textarea } from "@/components/ui/textarea";
import { ISharedFormInput } from "./types";

interface IFormTextArea extends ISharedFormInput {
  rows?: number;
}

export function FormTextArea(formInput: IFormTextArea) {
  const { input, rows = 3, placeholder, disabled, meta } = formInput;
  const { _ } = useLingui();
  return (
    <LabelAndError formInput={formInput}>
      <Textarea
        {...generateFormArias(meta)}
        name={input.name}
        id={input.name}
        className={generateClassNames(meta)}
        onChange={input.onChange}
        onFocus={input.onFocus}
        onBlur={input.onBlur}
        rows={rows}
        placeholder={placeholder ? _(placeholder) : null}
        disabled={disabled}
      >
        {input.value}
      </Textarea>
    </LabelAndError>
  );
}
