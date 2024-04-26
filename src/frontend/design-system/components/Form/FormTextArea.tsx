import styled from "styled-components";
import { useLingui } from "@lingui/react";
import { Input } from "./Styles";
import { ISharedFormInput } from "./_types";
import { wrapLabelAndError, generateFormArias } from "./_wrapForm";

const TextArea = styled(Input)`
  height: auto;
  overflow: auto;
  resize: vertical;
`;

interface IFormTextArea extends ISharedFormInput {
  rows?: number;
}

export const FormTextArea = (formInput: IFormTextArea) => {
  const { input, rows = 3, placeholder, disabled, meta } = formInput;
  const { _ } = useLingui();
  return wrapLabelAndError(
    <TextArea
      {...generateFormArias(meta)}
      as="textarea"
      value={input.value}
      name={input.name}
      id={formInput.input.name}
      onChange={input.onChange}
      onFocus={input.onFocus}
      onBlur={input.onBlur}
      rows={rows}
      placeholder={_(placeholder)}
      disabled={disabled}
    >
      {input.value}
    </TextArea>,
    formInput
  );
};
