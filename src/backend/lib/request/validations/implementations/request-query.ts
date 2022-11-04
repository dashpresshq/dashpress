import { progammingError } from "backend/lib/errors";
import { ValidationImplType } from "./types";

export const requestQueryValidationImpl: ValidationImplType<string> = async (
  req,
  requestOption: unknown
) => {
  progammingError(
    "Please provide the field to pull off the request query",
    !requestOption
  );

  progammingError(
    "Invalid request query field",
    typeof requestOption !== "string"
  );

  const value = req.query[requestOption as string];
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};
