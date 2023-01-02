import { BadRequestError } from "backend/lib/errors";
import { usersService } from "backend/users/users.service";
import { ValidationImplType } from "./types";

export const withPasswordValidationImpl: ValidationImplType<void> = async (
  req
) => {
  try {
    await usersService.checkUserPassword({
      username: req.user.username,
      password: req.body.password,
    });
  } catch (error) {
    throw new BadRequestError("Invalid Password");
  }
};
