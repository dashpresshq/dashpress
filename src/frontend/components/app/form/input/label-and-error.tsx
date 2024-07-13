import { i18n } from "@lingui/core";
import type { ReactNode } from "react";
import type { FieldMetaState } from "react-final-form";

import { Label } from "@/components/ui/label";
import { cn } from "@/components/utils";

import { SoftButton } from "../../button/soft";
import { SystemIcon } from "../../system-icons";
import { Tooltip } from "../../tooltip";
import type { ILabelAndErrorProps } from "./types";

export const isFormMetaWithError = (meta: FieldMetaState<any>) =>
  meta && meta.touched && meta.invalid && meta.error;

interface IProps {
  formInput: ILabelAndErrorProps;
  children?: ReactNode;
}

export function LabelAndError({ formInput, children }: IProps) {
  const {
    meta,
    label,
    input,
    required,
    description,
    rightActions = [],
  } = formInput;
  return (
    <>
      <div className="flex justify-between">
        <div>
          {label && (
            <>
              <Label htmlFor={input.name}>{i18n._(label)}</Label>
              {required ? (
                <span className="font-extrabold text-red-600">*</span>
              ) : null}
            </>
          )}
          {description ? (
            <Tooltip isOverAButton={false} text={description}>
              <SystemIcon icon="Help" className="ml-1 size-4" />
            </Tooltip>
          ) : null}
        </div>
        {rightActions.length > 0 && (
          <div className="mb-1 flex flex-1 justify-end gap-3">
            {rightActions.map((rightAction) => (
              <SoftButton
                key={rightAction.label.message}
                action={rightAction.action}
                size="sm"
                systemIcon={rightAction.systemIcon}
                label={rightAction.label}
              />
            ))}
          </div>
        )}
      </div>
      {children}
      <p
        className="pb-0 text-xs text-red-600"
        role={isFormMetaWithError(meta) ? "alert" : undefined}
      >
        {isFormMetaWithError(meta)}
        &nbsp;
      </p>
    </>
  );
}

export const generateClassNames = (meta: FieldMetaState<any>): string =>
  cn({
    "ring-1 !ring-red-600": !!isFormMetaWithError(meta),
  });

export const generateFormArias = (
  meta?: FieldMetaState<any>
): Record<string, string> => {
  const formArias = {};

  if (isFormMetaWithError(meta)) {
    formArias["aria-invalid"] = "true";
  }
  return formArias;
};
