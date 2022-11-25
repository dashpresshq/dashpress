import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { runValidationError } from "shared/validations/run";
import { BadRequestError } from ".";

export const validateSchemaRequestBody = (
  requestValidation: IAppliedSchemaFormConfig<any>,
  data: Record<string, unknown>
) => {
  const validationsError = runValidationError(requestValidation)(data);

  if (Object.values(validationsError).filter((x) => x).length > 0) {
    throw new BadRequestError("Invalid Request", validationsError);
  }
};
