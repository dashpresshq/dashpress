import { entityValidationImpl } from "./entity";
import { ValidationImplType } from "./types";
import { validateEntityFields } from "./_validateEntityField";

export const entityRequestBodyValidationImpl: ValidationImplType<
  Record<string, unknown>
> = async (req) => {
  const { data } = req.body;
  const entity = await entityValidationImpl(req);
  await validateEntityFields(entity, Object.keys(data));
  // TODO run the configured validations
  return data;
};
