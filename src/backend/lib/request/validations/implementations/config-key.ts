import { CONFIGURATION_KEYS } from "../../../../../shared/configuration.constants";
import { BadRequestError } from "../../../errors";
import { ValidationImplType } from "./types";

export const configKeyFilterValidationImpl: ValidationImplType<
  keyof typeof CONFIGURATION_KEYS
> = async (req) => {
  const key = req.query.key as string;
  const configBag = CONFIGURATION_KEYS[key];
  if (!configBag) {
    throw new BadRequestError(
      `Configuration doesn't key '${key}' doesn't exist`
    );
  }
  if (configBag.requireEntity && !req.query.entity) {
    throw new BadRequestError(`Configuration of key '${key}' requires entity`);
  }
  return key as keyof typeof CONFIGURATION_KEYS;
};
