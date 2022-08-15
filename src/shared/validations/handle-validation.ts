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
    errorMessage: string,
    constraints: Record<string, unknown>,
    allValues: Record<string, unknown>
  ) => {
    if (isEmpty(value)) {
      return undefined;
    }

    return validate(value, constraints[parameterKey], allValues)
      ? undefined
      : errorMessage;
  };
