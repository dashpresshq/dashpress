import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import { noop } from "shared/lib/noop";
import { useLingui } from "@lingui/react";
import { ISharedFormInput } from "../../../../../components/app/form/input/types";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import {
  LabelAndError,
  generateClassNames,
} from "@/components/app/form/input/label-and-error";
import styles from "@/components/app/render-code/styles.module.css";
import { cn } from "@/lib/utils";

interface IFormCodeEditor extends ISharedFormInput {
  language?: "javascript";
}

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
      <div
        className={cn(
          generateClassNames(meta),
          "line-numbers",
          "border border-border !rounded-sm [&_pre]:min-h-12 disabled:[&_textarea]:bg-soft focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
          styles.root
        )}
      >
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
          className="form-code-editor min-h-72 text-sm"
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
          }}
        />
      </div>
    </LabelAndError>
  );
}
