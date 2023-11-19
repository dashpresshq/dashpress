import React from "react";
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import dynamic from "next/dynamic";
import { SYSTEM_COLORS } from "frontend/design-system/theme/system";
import { noop } from "shared/lib/noop";
import { ISharedFormInput } from "../_types";
import { generateClassNames, wrapLabelAndError } from "../_wrapForm";

const ReactQuill = dynamic<any>(
  () => {
    return import("react-quill");
  },
  { ssr: false }
);

const Root = styled.div`
  .ql-editor {
    min-height: 18em;
    border: none;
    border-radius: 0;
  }

  .ql-toolbar {
    display: block;
    background: ${USE_ROOT_COLOR("soft-color")};
    color: ${USE_ROOT_COLOR("main-text")};
    border: 1px solid ${USE_ROOT_COLOR("border-color")};
    border-radius: 0.25rem 0.25rem 0 0;
  }

  .ql-stroke,
  .ql-fill {
    color: ${USE_ROOT_COLOR("main-text")};
    stroke: ${USE_ROOT_COLOR("main-text")};
  }

  .ql-snow.ql-toolbar button:hover,
  .ql-snow .ql-toolbar button:hover,
  .ql-snow.ql-toolbar button:focus,
  .ql-snow .ql-toolbar button:focus,
  .ql-snow.ql-toolbar button.ql-active,
  .ql-snow .ql-toolbar button.ql-active,
  .ql-snow.ql-toolbar .ql-picker-label:hover,
  .ql-snow .ql-toolbar .ql-picker-label:hover,
  .ql-snow.ql-toolbar .ql-picker-label.ql-active,
  .ql-snow .ql-toolbar .ql-picker-label.ql-active,
  .ql-snow.ql-toolbar .ql-picker-item:hover,
  .ql-snow .ql-toolbar .ql-picker-item:hover,
  .ql-snow.ql-toolbar .ql-picker-item.ql-selected,
  .ql-snow .ql-toolbar .ql-picker-item.ql-selected {
    color: ${USE_ROOT_COLOR("primary-color")};
  }

  .ql-toolbar button:hover .ql-stroke {
    stroke: ${USE_ROOT_COLOR("primary-color")};
  }

  .ql-container {
    background: ${USE_ROOT_COLOR("base-color")};
    border: 1px solid ${USE_ROOT_COLOR("border-color")};
    border-radius: 0 0 0.25rem 0.25rem;
  }

  .ql-container.ql-disabled {
    background-color: ${USE_ROOT_COLOR("soft-color")};
    opacity: 1;
  }

  .ql-editor.ql-blank::before {
    color: ${USE_ROOT_COLOR("muted-text")};
  }

  .ql-picker {
    color: ${USE_ROOT_COLOR("main-text")};
  }

  .quill {
    &.invalid {
      border: 1px solid ${SYSTEM_COLORS.danger} !important;
    }
  }
`;

interface IFormRichText extends ISharedFormInput {
  nothingForNow?: string;
}

const modules = {
  toolbar: [
    [{ size: [] }, { font: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

export const FormRichTextArea: React.FC<IFormRichText> = (formInput) => {
  const {
    input: { onFocus, onBlur, ...inputProps },
    disabled,
    meta,
  } = formInput;
  noop(onBlur, onFocus);
  return wrapLabelAndError(
    <Root>
      <ReactQuill
        {...inputProps}
        className={generateClassNames(meta)}
        readOnly={disabled}
        modules={modules}
        id={formInput.input.name}
        placeholder="Write something..."
        theme="snow"
      />
    </Root>,
    formInput
  );
};
