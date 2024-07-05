import type { MessageDescriptor } from "@lingui/core";
import { isEmpty } from "class-validator";

export const handleValidation =
  (
    validate: (
      value: unknown,
      parameter?: unknown,
      allValues?: Record<string, unknown>
    ) => boolean,
    parameterKey?: string
  ) =>
  (
    value: unknown,
    errorMessage: MessageDescriptor,
    constraints: Record<string, unknown>,
    allValues: Record<string, unknown>
  ) => {
    if (isEmpty(value)) {
      return undefined;
    }

    return validate(
      value,
      parameterKey === "pattern"
        ? new RegExp(constraints[parameterKey] as string)
        : constraints[parameterKey],
      allValues
    )
      ? undefined
      : errorMessage;
  };
