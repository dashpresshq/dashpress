import { rolesService } from "backend/roles/roles.service";
import { META_USER_PERMISSIONS, USER_PERMISSIONS } from "shared/types/user";
import { NotFoundError } from "../../../errors";
import { entitiesService } from "../../../../entities/entities.service";
import { configurationService } from "../../../../configuration/configuration.service";
import { ValidationImplType } from "./types";

const ERROR_MESSAGE = `This resource doesn't exist or is disabled or you dont have access to it`;

export const entityValidationImpl: ValidationImplType<string> = async (req) => {
  const entity = req.query.entity as string;

  const [entityExists, disabledEntities] = await Promise.all([
    entitiesService.getEntityFromSchema(entity),
    configurationService.show<string[]>("disabled_entities"),
  ]);

  if (!entityExists) {
    throw new NotFoundError(ERROR_MESSAGE);
  }

  if (disabledEntities.includes(entity)) {
    if (
      !(await rolesService.canRoleDoThis(
        req.user.role,
        USER_PERMISSIONS.CAN_CONFIGURE_APP
      ))
    ) {
      throw new NotFoundError(ERROR_MESSAGE);
    }
  }

  if (
    !(await rolesService.canRoleDoThis(
      req.user.role,
      META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(entity)
    ))
  ) {
    throw new NotFoundError(ERROR_MESSAGE);
  }

  return entity;
};
