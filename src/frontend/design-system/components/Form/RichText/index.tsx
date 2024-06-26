import "react-quill/dist/quill.snow.css";
import styled from "styled-components";
import dynamic from "next/dynamic";
import { SYSTEM_COLORS } from "frontend/design-system/theme/system";
import { noop } from "shared/lib/noop";
import { ISharedFormInput } from "../../../../../components/app/form/input/types";
import {
  LabelAndError,
  generateClassNames,
} from "@/components/app/form/input/label-and-error";

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
    background: hsl(var(--dp-soft));
    color: hsl(var(--dp-main));
    border: 1px solid hsl(var(--dp-border));
    border-radius: 0.25rem 0.25rem 0 0;
  }

  .ql-stroke,
  .ql-fill {
    color: hsl(var(--dp-main));
    stroke: hsl(var(--dp-main));
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
    color: hsl(var(--dp-primary));
  }

  .ql-toolbar button:hover .ql-stroke {
    stroke: hsl(var(--dp-primary));
  }

  .ql-container {
    background: hsl(var(--dp-base));
    border: 1px solid hsl(var(--dp-border));
    border-radius: 0 0 0.25rem 0.25rem;
  }

  .ql-container.ql-disabled {
    background-color: hsl(var(--dp-soft));
    opacity: 1;
  }

  .ql-editor.ql-blank::before {
    color: hsl(var(--dp-muted));
  }

  .ql-picker {
    color: hsl(var(--dp-main));
  }

  .quill {
    &.invalid {
      border: 1px solid ${SYSTEM_COLORS.danger} !important;
    }
  }
`;

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

export function FormRichTextArea(formInput: ISharedFormInput) {
  const {
    input: { onFocus, name, onBlur, ...inputProps },
    disabled,
    meta,
    placeholder,
  } = formInput;
  noop(onBlur, onFocus);
  return (
    <LabelAndError formInput={formInput}>
      <Root>
        <ReactQuill
          {...inputProps}
          className={generateClassNames(meta)}
          readOnly={disabled}
          modules={modules}
          id={name}
          placeholder={placeholder}
          theme="snow"
        />
      </Root>
    </LabelAndError>
  );
}
