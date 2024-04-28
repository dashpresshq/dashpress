import { ForbiddenError, progammingError } from "backend/lib/errors";
import { rolesApiService } from "backend/roles/roles.service";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { UserPermissions } from "shared/constants/user";
import { ValidationImplType } from "./types";

const ERROR_MESSAGE =
  "Your account doesn't have enough priviledge to perform this action";

export const canUserValidationImpl: ValidationImplType<void> = async (
  req,
  requiredPermission: UserPermissions
): Promise<void> => {
  progammingError(
    "Please provide the required permission",
    !requiredPermission
  );

  progammingError(
    "The provided permission seems to be invalid",
    !Object.values(UserPermissions).includes(requiredPermission)
  );

  if (
    !(await rolesApiService.canRoleDoThis(req.user.role, requiredPermission))
  ) {
    throw new ForbiddenError(
      `${ERROR_MESSAGE}: (${userFriendlyCase(requiredPermission)})`
    );
  }
};
