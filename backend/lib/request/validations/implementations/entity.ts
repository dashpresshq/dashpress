import { rolesService } from "backend/roles/roles.service";
import { APPLIED_CAN_ACCESS_ENTITY } from "shared/types";
import { ForbiddenError } from "../../../errors";
import { entitiesService } from "../../../../entities/entities.service";
import { configurationService } from "../../../../configuration/configuration.service";
import { ValidationImplType } from "./types";

export const entityValidationImpl: ValidationImplType<string> = async (req) => {
  const entity = req.query.entity as string;

  const [entityExists, disabledEntities] = await Promise.all([
    entitiesService.getEntityFromSchema(entity),
    configurationService.show<string[]>("disabled_entities"),
  ]);

  if (disabledEntities.includes(entity) || !entityExists) {
    throw new ForbiddenError(`Entity '${entity}' doesn't exist or is disabled`);
  }

  if (
    !(await rolesService.canRoleDoThis(
      req.user.role,
      APPLIED_CAN_ACCESS_ENTITY(entity)
    ))
  ) {
    throw new ForbiddenError(`You dont enug`);
  }

  return entity;
};
