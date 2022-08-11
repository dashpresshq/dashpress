import { rolesService } from "backend/roles/roles.service";
import { APPLIED_CAN_ACCESS_ENTITY } from "shared/types";
import { ForbiddenError } from "../../../errors";
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

  if (disabledEntities.includes(entity) || !entityExists) {
    throw new ForbiddenError(ERROR_MESSAGE);
  }

  if (
    !(await rolesService.canRoleDoThis(
      req.user.role,
      APPLIED_CAN_ACCESS_ENTITY(entity)
    ))
  ) {
    throw new ForbiddenError(ERROR_MESSAGE);
  }

  return entity;
};
