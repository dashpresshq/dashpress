import { useEntityDictionPlurals } from "frontend/hooks/entity/entity.queries";
import { useActiveEntities } from "frontend/hooks/entity/entity.store";
import {
  META_USER_PERMISSIONS,
  USER_PERMISSIONS_CONFIG,
  UserPermissions,
} from "shared/constants/user";
import { GranularEntityPermissions } from "shared/types/user";
import { i18nNoop } from "translations/fake";
import { MutatePermission } from "../MutatePermission";

export function BaseMutateEntitiesPermissions() {
  const activeEntities = useActiveEntities();

  const getEntitiesDictionPlurals = useEntityDictionPlurals(
    activeEntities.data,
    "value"
  );

  const entitiesAsPermissionList = [
    ...activeEntities.data.map((entity) => ({
      value: META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(
        entity.value,
        GranularEntityPermissions.Show
      ),
      label: i18nNoop(getEntitiesDictionPlurals(entity.value)),
    })),
  ];

  return (
    <MutatePermission
      permissionList={entitiesAsPermissionList}
      overAchingPermission={{
        permission: UserPermissions.CAN_MANAGE_ALL_ENTITIES,
        label:
          USER_PERMISSIONS_CONFIG[UserPermissions.CAN_MANAGE_ALL_ENTITIES]
            .label,
      }}
    />
  );
}
