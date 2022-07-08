import noop from "lodash/noop";
import { isEmpty } from "class-validator";

export const handleValidation =
  (
    validate: (value: unknown, parameter?: unknown) => boolean,
    parameterKey?: string
  ) =>
  (
    value: unknown,
    errorMessage: string,
    constraints: Record<string, unknown>,
    allValues: Record<string, unknown>
  ) => {
    noop(allValues);

    if (isEmpty(value)) {
      return undefined;
    }

    return validate(value, constraints[parameterKey])
      ? undefined
      : errorMessage;
  };
