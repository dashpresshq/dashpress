import { useUserHasPermission } from "frontend/hooks/auth/user.store";
import { useEntityCrudSettings } from "frontend/hooks/entity/entity.config";
import { IEntityCrudSettings } from "shared/configurations";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import { GranularEntityPermissions } from "shared/types/user";

type CrudActionData = keyof IEntityCrudSettings | "table";

const ACTION_CONFIG_MAP: Record<CrudActionData, GranularEntityPermissions> = {
  create: GranularEntityPermissions.Create,
  delete: GranularEntityPermissions.Delete,
  details: GranularEntityPermissions.Show,
  update: GranularEntityPermissions.Update,
  table: GranularEntityPermissions.Show,
};

export const useCanUserPerformCrudAction = (entity: string) => {
  const entityCrudSettings = useEntityCrudSettings(entity);
  const userHasPermission = useUserHasPermission();

  return (action: CrudActionData) => {
    if (!entity) {
      return false;
    }

    if (
      userHasPermission(
        META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(
          entity,
          ACTION_CONFIG_MAP[action]
        )
      )
    ) {
      return true;
    }

    if (action === "table") {
      /* As there is no crud setting for table */
      return true;
    }

    return entityCrudSettings?.data?.[action];
  };
};
