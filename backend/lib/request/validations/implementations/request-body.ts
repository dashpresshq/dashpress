import { BadRequestError } from "backend/lib/errors";
import { IAppliedSchemaFormConfig } from "shared/form-schemas";
import { makeRequestValidationRunnable } from "shared/validations/makeRequestValidationRunnable";
import { ValidationImplType } from "./types";

export const requestBodyValidationImpl: ValidationImplType<
  Record<string, unknown>
> = async (req, requestValidation: IAppliedSchemaFormConfig<any>) => {
  if (!requestValidation) {
    throw new Error("Please provide the request validation");
  }
  const reqBodyData = req.body;

  const validationsError =
    makeRequestValidationRunnable(requestValidation)(reqBodyData);

  if (Object.values(validationsError).filter((x) => x).length > 0) {
    throw new BadRequestError("Invalid Request", validationsError);
  }

  return reqBodyData;
};
