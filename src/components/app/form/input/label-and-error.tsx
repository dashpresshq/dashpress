import { FieldMetaState } from "react-final-form";
import { i18n } from "@lingui/core";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { SystemIcon } from "../../system-icons";
import { SoftButton } from "../../button/soft";
import { ILabelAndErrorProps } from "./types";
import { Tooltip } from "../../tooltip";

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
              <SystemIcon icon="Help" className="w-4 h-4 ml-1" />
            </Tooltip>
          ) : null}
        </div>
        {rightActions.length > 0 && (
          <div className="flex gap-3 flex-1 justify-end mb-1">
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
        className="text-red-600 text-xs pb-0"
        role={isFormMetaWithError(meta) ? "alert" : undefined}
      >
        {isFormMetaWithError(meta)}
        &nbsp;
      </p>
    </>
  );
}

// :eyes this is applied correctly on all forms

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
