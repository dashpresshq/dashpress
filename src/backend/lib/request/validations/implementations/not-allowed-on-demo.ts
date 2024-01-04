import { BadRequestError } from "backend/lib/errors";
import { ValidationImplType } from "./types";

export const notAllowedOnDemoValidationImpl: ValidationImplType<
  void
> = async () => {
  if (process.env.NEXT_PUBLIC_IS_DEMO) {
    throw new BadRequestError("This service is not available on the demo site");
  }
};
