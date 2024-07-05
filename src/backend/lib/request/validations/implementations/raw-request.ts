import type { ValidationImplType } from "./types";

export const rawRequestValidationImpl: ValidationImplType<
  Record<string, unknown>
> = async (req) => {
  return req as unknown as Record<string, unknown>;
};
