import { IEntityCrudSettings } from "shared/configuration.constants";
import { configurationService } from "../../../../configuration/configuration.service";
import { ForbiddenError } from "../../../errors";
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

export const canCrudValidationImpl: ValidationImplType<void> = async (req) => {
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
