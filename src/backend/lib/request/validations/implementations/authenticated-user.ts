import { progammingError } from "@/backend/lib/errors";
import type { IAccountProfile } from "@/shared/types/user";

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
