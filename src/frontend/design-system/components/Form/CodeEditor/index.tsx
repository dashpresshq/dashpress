import styled from "styled-components";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import { SYSTEM_COLORS } from "frontend/design-system/theme/system";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { noop } from "shared/lib/noop";
import { useLingui } from "@lingui/react";
import { ISharedFormInput } from "../types";
import { LabelAndError, generateClassNames } from "../LabelAndError";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import { PrismTokenStyles } from "../../RenderCode/styles";

interface IFormCodeEditor extends ISharedFormInput {
  language?: "javascript";
}

const Wrapper = styled.div`
  border: 1px solid ${USE_ROOT_COLOR("border-color")};

  &.invalid {
    border-color: ${SYSTEM_COLORS.danger} !important;
  }

  textarea:disabled {
    background: ${USE_ROOT_COLOR("soft-color")} !important;
  }

  border-radius: 0.25rem;

  &:focus {
    border-color: ${USE_ROOT_COLOR("primary-color")};
    outline: 0;
  }

  pre {
    min-height: 50px;
  }

  ${PrismTokenStyles}
`;

export function FormCodeEditor(formInput: IFormCodeEditor) {
  const {
    input: { onFocus, name, onBlur, ...inputProps },
    meta,
    language,
    placeholder,
    disabled,
  } = formInput;
  noop(onFocus, onBlur);

  const { _ } = useLingui();

  return (
    <LabelAndError formInput={formInput}>
      <Wrapper className={`${generateClassNames(meta)} line-numbers`}>
        <Editor
          {...inputProps}
          onValueChange={inputProps.onChange}
          highlight={(code) =>
            highlight(code, languages[language || "javascript"])
          }
          disabled={disabled}
          placeholder={placeholder ? _(placeholder) : undefined}
          textareaId={name}
          padding={4}
          className="form-code-editor"
          style={{
            minHeight: "275px",
            fontFamily: '"Fira code", "Fira Mono", monospace',
          }}
        />
      </Wrapper>
    </LabelAndError>
  );
}
