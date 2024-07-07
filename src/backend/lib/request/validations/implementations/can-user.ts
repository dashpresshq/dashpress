import { ForbiddenError, progammingError } from "@/backend/lib/errors";
import { rolesApiService } from "@/backend/roles/roles.service";
import { PORTAL_USER_PERMISSIONS } from "@/shared/constants/portal/user";
import { UserPermissions } from "@/shared/constants/user";
import { userFriendlyCase } from "@/shared/lib/strings/friendly-case";

import type { ValidationImplType } from "./types";

const ERROR_MESSAGE =
  "Your account doesn't have enough priviledge to perform this action";

const ALL_PERMISSIONS = Object.values({
  ...UserPermissions,
  ...PORTAL_USER_PERMISSIONS,
});

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
    !ALL_PERMISSIONS.includes(requiredPermission)
  );

  if (
    !(await rolesApiService.canRoleDoThis(req.user.role, requiredPermission))
  ) {
    throw new ForbiddenError(
      `${ERROR_MESSAGE}: (${userFriendlyCase(requiredPermission)})`
    );
  }
};
