import styled from "styled-components";
import { useLingui } from "@lingui/react";
import { Input } from "../Styles";
import { ISharedFormInput } from "../types";
import { generateFormArias, LabelAndError } from "../LabelAndError";

const TextArea = styled(Input)`
  height: auto;
  overflow: auto;
  resize: vertical;
`;

interface IFormTextArea extends ISharedFormInput {
  rows?: number;
}

export function FormTextArea(formInput: IFormTextArea) {
  const { input, rows = 3, placeholder, disabled, meta } = formInput;
  const { _ } = useLingui();
  return (
    <LabelAndError formInput={formInput}>
      <TextArea
        {...generateFormArias(meta)}
        as="textarea"
        value={input.value}
        name={input.name}
        id={input.name}
        onChange={input.onChange}
        onFocus={input.onFocus}
        onBlur={input.onBlur}
        rows={rows}
        placeholder={placeholder ? _(placeholder) : null}
        disabled={disabled}
      >
        {input.value}
      </TextArea>
    </LabelAndError>
  );
}
