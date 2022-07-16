import { ValidationImplType } from "./types";

export const entityIdFilterValidationImpl: ValidationImplType<string> = async (
  req
) => {
  // This needs to go through some validation, uuid, integer,
  return req.query.id as string;
};
