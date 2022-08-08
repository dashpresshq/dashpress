import { ValidationImplType } from "./types";

export const requestQueryValidationImpl: ValidationImplType<string> = async (
  req,
  requestOption: unknown
) => {
  if (!requestOption) {
    throw new Error("Please provide the field to pull off the request query");
  }

  if (typeof requestOption !== "string") {
    throw new Error("Invalid request query field");
  }

  const value = req.query[requestOption];
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};
