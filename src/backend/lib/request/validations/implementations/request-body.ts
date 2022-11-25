import { progammingError } from "backend/lib/errors";
import { validateSchemaRequestBody } from "backend/lib/errors/validate-schema-request-input";
import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { ValidationImplType } from "./types";

export const requestBodyValidationImpl: ValidationImplType<
  Record<string, unknown>
> = async (req, requestValidation: IAppliedSchemaFormConfig<any>) => {
  progammingError("Please provide the request validation", !requestValidation);

  validateSchemaRequestBody(requestValidation, req.body);

  return req.body;
};
