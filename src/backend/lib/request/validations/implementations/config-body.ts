import { ValidationImplType } from "./types";

export const configBodyValidationImpl: ValidationImplType<
  Record<string, unknown>
> = async (req) => {
  return req.body.data;
};
