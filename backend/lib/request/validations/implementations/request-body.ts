import { entityValidationImpl } from "./entity";
import { ValidationImplType } from "./types";
import { validateEntityFields } from "./_validateEntityField";

export const requestBodyValidationImpl: ValidationImplType<
  Record<string, unknown>
> = async (req) => {
  const { data } = req.body;
  const entity = await entityValidationImpl(req);
  await validateEntityFields(entity, Object.keys(data));

  return data;
};
