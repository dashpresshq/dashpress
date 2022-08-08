import { ValidationImplType } from "./types";

export const entityIdFilterValidationImpl: ValidationImplType<string> = async (
  req
) => {
  // This needs to go through some validation, uuid, integer,
  const value = req.query.id;

  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};
