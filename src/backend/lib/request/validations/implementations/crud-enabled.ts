import { DataActionType, IEntityCrudSettings } from "shared/configurations";
import { ForbiddenError, progammingError } from "backend/lib/errors";
import { configurationService } from "backend/configuration/configuration.service";
import { getEntityFromRequest } from "./entity";
import { ValidationImplType } from "./types";

const EntityCrudCheck: Record<
  DataActionType,
  { entityCrudField?: keyof IEntityCrudSettings }
> = {
  create: { entityCrudField: "create" },
  details: { entityCrudField: "details" },
  update: { entityCrudField: "update" },
  delete: { entityCrudField: "delete" },
  list: { entityCrudField: undefined },
  table: { entityCrudField: undefined },
  count: { entityCrudField: undefined },
  reference: { entityCrudField: undefined },
};

export const crudEnabledValidationImpl: ValidationImplType<void> = async (
  req,
  action: unknown
) => {
  progammingError("Please provide the action for the CRUD check", !action);

  progammingError(
    "Invalid action for crud-enabled check",
    !EntityCrudCheck[action as DataActionType]
  );

  const actionType = action as DataActionType;

  const entity = getEntityFromRequest(req);

  if (
    EntityCrudCheck[actionType].entityCrudField &&
    !(
      await configurationService.show<IEntityCrudSettings>(
        "entity_crud_settings",
        entity
      )
    )[actionType]
  ) {
    throw new ForbiddenError(
      `Action '${actionType}' has been disabled for '${entity}'`
    );
  }
};
