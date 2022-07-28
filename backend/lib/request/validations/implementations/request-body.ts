import { BadRequestError } from "backend/lib/errors";
import { makeRequestValidationRunnable } from "shared/validations/makeRequestValidationRunnable";
import { ValidationImplType, IRequestValidation } from "./types";

export const requestBodyValidationImpl: ValidationImplType<
  Record<string, unknown>
> = async (req, requestValidation: IRequestValidation) => {
  const reqBodyData = req.body;

  const validationsError =
    makeRequestValidationRunnable(requestValidation)(reqBodyData);

  if (Object.values(validationsError).filter((x) => x).length > 0) {
    throw new BadRequestError("Invalid Request", validationsError);
  }

  return reqBodyData;
};
