import type { NextApiRequest } from "next";

import { entitiesApiService } from "@/backend/entities/entities.service";
import { NotFoundError } from "@/backend/lib/errors";

import type { ValidationImplType } from "./types";

export const ERROR_MESSAGE = `This resource doesn't exist or is disabled or you dont have access to it`;

export const getEntityFromRequest = (req: NextApiRequest) => {
  return req.query.entity as string;
};

export const entityValidationImpl: ValidationImplType<string> = async (
  req,
  isConfigRequest
) => {
  const entity = getEntityFromRequest(req);

  // If no entity is provided, we assume that the request is for the app itself
  if (!entity) {
    return "";
  }

  const [entityExists, isEntityDisabled] = await Promise.all([
    entitiesApiService.entityExist(entity),
    entitiesApiService.isEntityDisabled(entity),
  ]);

  if (!entityExists) {
    throw new NotFoundError(ERROR_MESSAGE);
  }

  if (isEntityDisabled && !isConfigRequest) {
    throw new NotFoundError(ERROR_MESSAGE);
  }

  return entity;
};
