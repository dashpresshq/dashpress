import { ValidationImplType } from "./types";

export const entityRequestBodyValidationImpl: ValidationImplType<
  Record<string, unknown>
> = async (req) => {
  const { data } = req.body;
  /*
  For performance reasons all the required validations will be done in the controller
  So that we can parallelize all the async requests
  */
  return data;
};
