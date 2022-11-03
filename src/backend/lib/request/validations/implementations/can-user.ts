import { ForbiddenError, progammingError } from "backend/lib/errors";
import { rolesService } from "backend/roles/roles.service";
import { USER_PERMISSIONS } from "shared/types/user";
import { ValidationImplType } from "./types";

const ERROR_MESSAGE =
  "Your account doesn't have enough priviledge to perform this action";

export const canUserValidationImpl: ValidationImplType<void> = async (
  req,
  requiredPermission: string
): Promise<void> => {
  progammingError(
    "Please provide the required permission",
    !requiredPermission
  );

  if (!Object.values(USER_PERMISSIONS).includes(requiredPermission)) {
    throw new Error("The provided permission seems to be invalid");
  }

  if (!(await rolesService.canRoleDoThis(req.user.role, requiredPermission))) {
    throw new ForbiddenError(ERROR_MESSAGE);
  }
};
