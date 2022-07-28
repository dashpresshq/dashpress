import { ValidationImplType } from "./types";

export const configBodyValidationImpl: ValidationImplType<
  Record<string, unknown>
> = async (req) => {
  // TODO Will need to have validation config on `CONFIGURATION_KEYS` then we fetch that and validate here
  return req.body.data;
};
