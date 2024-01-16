import React from "react";
import classnames from "classnames";
import { FieldMetaState } from "react-final-form";
import { Stack } from "frontend/design-system/primitives/Stack";
import { SystemIcon } from "frontend/design-system/Icons/System";
import { ISharedFormInput } from "./_types";
import { Tooltip } from "../Tooltip";
import { FormGroup, FormLabel, FormFeedback, RequiredAsterick } from "./Styles";
import { SoftButton } from "../Button/SoftButton";

export const isFormMetaWithError = (meta: FieldMetaState<any>) =>
  meta && meta.touched && meta.invalid && meta.error;

export const wrapLabelAndError = (
  formComponent: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  {
    meta,
    label,
    input,
    required,
    description,
    sm,
    rightActions = [],
  }: ISharedFormInput
) => (
  <FormGroup>
    <>
      <Stack justify="space-between" align="baseline">
        <div>
          {label && (
            <>
              <FormLabel sm={sm} htmlFor={input.name}>
                {label}
              </FormLabel>
              {required ? <RequiredAsterick> *</RequiredAsterick> : null}
            </>
          )}
          {description ? (
            <Tooltip text={description} place="right">
              <SystemIcon icon="Help" size={15} />
            </Tooltip>
          ) : null}
        </div>
        <Stack flex={1} justify="end">
          {rightActions.map((rightAction) => (
            <SoftButton
              key={rightAction.label}
              action={rightAction.action}
              size="xs"
              type="button"
              systemIcon={rightAction.systemIcon}
              label={rightAction.label}
            />
          ))}
        </Stack>
      </Stack>
      {formComponent}
      <FormFeedback
        role={isFormMetaWithError(meta) ? "alert" : undefined}
        sm={sm}
      >
        {isFormMetaWithError(meta)}
        &nbsp;
      </FormFeedback>
    </>
  </FormGroup>
);

export const generateClassNames = (meta: FieldMetaState<any>): string =>
  classnames({
    invalid: !!isFormMetaWithError(meta),
  });

export const generateFormArias = (
  meta?: FieldMetaState<any>
): Record<string, string> => {
  if (!meta) {
    return {};
  }
  if (isFormMetaWithError(meta)) {
    return { "aria-invalid": "true", ariaInvalid: "true" };
  }
  return {};
};
