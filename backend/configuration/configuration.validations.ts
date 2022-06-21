import { CONFIGURATION_KEYS } from "../../shared/configuration.constants";
import { BadRequestError } from "../lib/errors";

export const validateConfigKeyFromRequest = (
  input: Record<string, unknown>,
  entity?: string
): keyof typeof CONFIGURATION_KEYS => {
  const key = input.key as string;
  const configBag = CONFIGURATION_KEYS[key];
  if (!configBag) {
    throw new BadRequestError(
      `Configuration doesn't key '${key}' doesn't exist`
    );
  }
  if (configBag.requireEntity && !entity) {
    throw new BadRequestError(`Configuration of key '${key}' requires entity`);
  }
  return key as keyof typeof CONFIGURATION_KEYS;
};
