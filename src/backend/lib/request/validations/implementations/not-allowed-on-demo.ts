import { BadRequestError } from "backend/lib/errors";
import { ValidationImplType } from "./types";

export const notAllowedOnDemoValidation = () => {
  if (process.env.NEXT_PUBLIC_IS_DEMO) {
    throw new BadRequestError("This action is not available on the demo site");
  }
};

export const notAllowedOnDemoValidationImpl: ValidationImplType<
  void
> = async () => {
  notAllowedOnDemoValidation();
};
