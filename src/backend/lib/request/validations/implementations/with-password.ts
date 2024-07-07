import { BadRequestError } from "@/backend/lib/errors";
import { usersApiService } from "@/backend/users/users.service";

import type { ValidationImplType } from "./types";

export const withPasswordValidationImpl: ValidationImplType<void> = async (
  req
) => {
  try {
    await usersApiService.checkUserPassword({
      username: req.user.username,
      password: req.body._password || req.query._password,
    });
  } catch (error) {
    throw new BadRequestError("Invalid Password");
  }
};
