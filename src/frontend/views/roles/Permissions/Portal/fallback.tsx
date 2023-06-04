import { useEntityDictionPlurals } from "frontend/hooks/entity/entity.queries";
import { useActiveEntities } from "frontend/hooks/entity/entity.store";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import { GranularEntityPermissions } from "shared/types/user";
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
      label: getEntitiesDictionPlurals(entity.value),
    })),
  ];

  return <MutatePermission permissionList={entitiesAsPermissionList} />;
}
