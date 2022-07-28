import { ForbiddenError } from "backend/lib/errors";
import { ValidationImplType } from "./types";

export const isCreatorValidationImpl: ValidationImplType<void> = async (
  req
) => {
  if (req.user.role !== "creator") {
    throw new ForbiddenError(
      "You need to be a creator to perform this request"
    );
  }
};
