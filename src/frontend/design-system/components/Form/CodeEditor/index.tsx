// eslint-disable-next-line simple-import-sort/imports
import { useLingui } from "@lingui/react";
import { highlight, languages } from "prismjs/components/prism-core";
import Editor from "react-simple-code-editor";
import { noop } from "shared/lib/noop";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";

import {
  generateClassNames,
  LabelAndError,
} from "@/components/app/form/input/label-and-error";
import type { ISharedFormInput } from "@/components/app/form/input/types";
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
        // eslint-disable-next-line tailwindcss/no-custom-classname
        className={cn(
          generateClassNames(meta),
          "line-numbers",
          "![&_textarea]:rounded-md !rounded-md border border-border [&_pre]:min-h-12 [&_textarea]:focus:border-primary [&_textarea]:focus:!outline-none [&_textarea]:focus:ring-1 [&_textarea]:focus:!ring-primary disabled:[&_textarea]:bg-soft",
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
