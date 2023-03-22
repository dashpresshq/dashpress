import { DataActionType, IEntityCrudSettings } from "shared/configurations";
import {
  ForbiddenError,
  NotFoundError,
  progammingError,
} from "backend/lib/errors";
import { configurationService } from "backend/configuration/configuration.service";
import { rolesService } from "backend/roles/roles.service";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import { GranularEntityPermissions } from "shared/types/user";
import { getEntityFromRequest, ERROR_MESSAGE } from "./entity";
import { ValidationImplType } from "./types";

const EntityCrudCheck: Record<
  DataActionType,
  {
    entityCrudField?: keyof IEntityCrudSettings;
    granularPermission: GranularEntityPermissions;
  }
> = {
  create: {
    entityCrudField: "create",
    granularPermission: GranularEntityPermissions.Create,
  },
  details: {
    entityCrudField: "details",
    granularPermission: GranularEntityPermissions.Show,
  },
  update: {
    entityCrudField: "update",
    granularPermission: GranularEntityPermissions.Update,
  },
  delete: {
    entityCrudField: "delete",
    granularPermission: GranularEntityPermissions.Delete,
  },
  list: {
    entityCrudField: undefined,
    granularPermission: GranularEntityPermissions.Show,
  },
  table: {
    entityCrudField: undefined,
    granularPermission: GranularEntityPermissions.Show,
  },
  count: {
    entityCrudField: undefined,
    granularPermission: GranularEntityPermissions.Show,
  },
  reference: {
    entityCrudField: undefined,
    granularPermission: GranularEntityPermissions.Show,
  },
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

  if (
    !(await rolesService.canRoleDoThis(
      req.user.role,
      META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(
        entity,
        EntityCrudCheck[actionType].granularPermission
      )
    ))
  ) {
    throw new NotFoundError(ERROR_MESSAGE);
  }
};
