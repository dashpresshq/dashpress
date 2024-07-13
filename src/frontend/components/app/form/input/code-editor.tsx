// eslint-disable-next-line simple-import-sort/imports
import { useLingui } from "@lingui/react";
import { highlight, languages } from "prismjs/components/prism-core";
import Editor from "react-simple-code-editor";
import { noop } from "@/shared/lib/noop";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";

import {
  generateClassNames,
  LabelAndError,
} from "@/components/app/form/input/label-and-error";
import type { ISharedFormInput } from "@/components/app/form/input/types";
import styles from "@/components/app/render-code/styles.module.css";
import { cn } from "@/components/utils";

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
        // eslint-disable-next-line tailwindcss/no-custom-classname
        className={cn(
          generateClassNames(meta),
          "line-numbers",
          "rounded-md border border-border p-2 shadow-sm focus:ring-1 focus:ring-primary",
          {
            "bg-soft": disabled,
          },
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
          textareaClassName="outline-none"
          preClassName="min-h-12"
          // eslint-disable-next-line tailwindcss/no-custom-classname
          className="form-code-editor min-h-72 text-sm"
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
          }}
        />
      </div>
    </LabelAndError>
  );
}
