import { configurationService } from "backend/configuration/configuration.service";
import { entitiesService } from "backend/entities/entities.service";
import { ForbiddenError } from "backend/lib/errors";
import { ValidationImplType } from "./types";

export const entityValidationImpl: ValidationImplType<string> = async (req) => {
  const entity = req.query.entity as string;

  const [entityExists, disabledEntities] = await Promise.all([
    entitiesService.getEntityFromSchema(entity),
    configurationService.show<string[]>("disabled_entities"),
  ]);

  if (disabledEntities.includes(entity) || !entityExists) {
    throw new ForbiddenError(`Entity ${entity} is not allowed`);
  }

  return entity;
};
