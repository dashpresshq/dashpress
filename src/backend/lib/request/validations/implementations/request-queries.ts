import { progammingError } from "backend/lib/errors";
import type { ValidationImplType } from "./types";

export const requestQueriesValidationImpl: ValidationImplType<
  Record<string, string>
> = async (req, requestOption: unknown) => {
  progammingError(
    "Please provide the field to pull off the request queries",
    !requestOption
  );

  progammingError(
    "Invalid request queries fields",
    !Array.isArray(requestOption)
  );

  return Object.fromEntries(
    (requestOption as string[]).map((key) => {
      const value = req.query[key];
      return [key, value as string];
    })
  );
};
