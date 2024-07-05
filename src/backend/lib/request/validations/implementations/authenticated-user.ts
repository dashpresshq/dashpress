import type { IAccountProfile } from "shared/types/user";
import { progammingError } from "backend/lib/errors";
import type { ValidationImplType } from "./types";

export const authenticatedUserValidationImpl: ValidationImplType<
  IAccountProfile
> = async (req) => {
  progammingError(
    "A non authenticated route tried to access user from request",
    !req.user
  );

  return req.user;
};
