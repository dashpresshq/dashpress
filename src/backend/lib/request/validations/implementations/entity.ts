import { rolesApiService } from "backend/roles/roles.service";
import { USER_PERMISSIONS } from "shared/constants/user";
import { NextApiRequest } from "next";
import { NotFoundError } from "../../../errors";
import { entitiesApiService } from "../../../../entities/entities.service";
import { ValidationImplType } from "./types";

export const ERROR_MESSAGE = `This resource doesn't exist or is disabled or you dont have access to it`;

export const getEntityFromRequest = (req: NextApiRequest) => {
  return req.query.entity as string;
};

export const entityValidationImpl: ValidationImplType<string> = async (req) => {
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

  if (isEntityDisabled) {
    if (
      !(await rolesApiService.canRoleDoThis(
        req.user.role,
        USER_PERMISSIONS.CAN_CONFIGURE_APP
      ))
    ) {
      throw new NotFoundError(ERROR_MESSAGE);
    }
  }

  return entity;
};
