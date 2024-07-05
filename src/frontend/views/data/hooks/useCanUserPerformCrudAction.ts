import { useUserHasPermission } from "frontend/hooks/auth/user.store";
import { useEntityCrudSettings } from "frontend/hooks/entity/entity.config";
import type { CrudViewsKeys } from "shared/configurations";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import { GranularEntityPermissions } from "shared/types/user";

const ACTION_CONFIG_MAP: Record<CrudViewsKeys, GranularEntityPermissions> = {
  create: GranularEntityPermissions.Create,
  delete: GranularEntityPermissions.Delete,
  details: GranularEntityPermissions.Show,
  update: GranularEntityPermissions.Update,
  table: GranularEntityPermissions.Show,
};

export const useCanUserPerformCrudAction = (entity: string) => {
  const entityCrudSettings = useEntityCrudSettings(entity);
  const userHasPermission = useUserHasPermission();

  return (action: CrudViewsKeys) => {
    if (!entity) {
      return false;
    }

    if (
      !userHasPermission(
        META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(
          entity,
          ACTION_CONFIG_MAP[action]
        )
      )
    ) {
      return false;
    }

    if (action === "table") {
      /* As there is no crud setting for table */
      return true;
    }

    return entityCrudSettings?.data?.[action];
  };
};
