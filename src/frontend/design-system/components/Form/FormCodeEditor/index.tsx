import React from "react";
import styled from "styled-components";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import { SYSTEM_COLORS } from "frontend/design-system/theme/system";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { noop } from "shared/lib/noop";
import { ISharedFormInput } from "../_types";
import { generateClassNames, wrapLabelAndError } from "../_wrapForm";
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

export const FormCodeEditor: React.FC<IFormCodeEditor> = (formInput) => {
  const {
    input: { onFocus, onBlur, ...inputProps },
    meta,
  } = formInput;
  noop(onFocus, onBlur);
  return wrapLabelAndError(
    <Wrapper className={`${generateClassNames(meta)} line-numbers`}>
      <Editor
        {...inputProps}
        onValueChange={inputProps.onChange}
        highlight={(code) =>
          highlight(code, languages[formInput.language || "javascript"])
        }
        disabled={formInput.disabled}
        textareaId={formInput.input.name}
        padding={4}
        style={{
          minHeight: "275px",
          fontFamily: '"Fira code", "Fira Mono", monospace',
        }}
      />
    </Wrapper>,
    formInput
  );
};
