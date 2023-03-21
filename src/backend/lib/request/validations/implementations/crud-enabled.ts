import { IEntityCrudSettings } from "shared/configurations";
import { ForbiddenError } from "backend/lib/errors";
import { configurationService } from "backend/configuration/configuration.service";
import { RequestMethod } from "../../methods";
import { entityValidationImpl } from "./entity";
import { ValidationImplType } from "./types";

const REQUEST_METHOD_TO_CRUD_ACTION: Partial<
  Record<RequestMethod, keyof IEntityCrudSettings>
> = {
  DELETE: "delete",
  POST: "create",
  PATCH: "update",
  GET: "details",
};

export const crudEnabledValidationImpl: ValidationImplType<void> = async (
  req
) => {
  const action = REQUEST_METHOD_TO_CRUD_ACTION[req.method];
  const entity = await entityValidationImpl(req);
  if (
    !(
      await configurationService.show<IEntityCrudSettings>(
        "entity_crud_settings",
        entity
      )
    )[action]
  ) {
    throw new ForbiddenError(
      `Action '${action}' has been disabled for '${entity}'`
    );
  }
};
