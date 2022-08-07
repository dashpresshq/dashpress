import { ForbiddenError } from "backend/lib/errors";
import { USER_PERMISSIONS } from "shared/types";
import { ValidationImplType } from "./types";

const ERROR_MESSAGE =
  "Your account doesn't have enough priviledge to perform this action";

export const canUserValidationImpl: ValidationImplType<void> = async (
  req,
  requiredPermission: string
) => {
  if (!requiredPermission) {
    throw new Error("Please provide the required permission");
  }

  if (!Object.values(USER_PERMISSIONS).includes(requiredPermission)) {
    throw new Error("The provided permission seems to be invalid");
  }

  if (req.user.role) {
    throw new ForbiddenError(ERROR_MESSAGE);
  }
  if (req.user.role === "creator") {
    return;
  }
  if (!req.user.permissionGroup) {
    throw new ForbiddenError(ERROR_MESSAGE);
  }
  // TODO Permission group data
  if (!req.user.permissionGroup) {
    throw new ForbiddenError(ERROR_MESSAGE);
  }
};
