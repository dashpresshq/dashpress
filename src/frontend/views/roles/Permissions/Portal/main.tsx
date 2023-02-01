import { useEntityDictionPlurals } from "frontend/hooks/entity/entity.queries";
import { useActiveEntities } from "frontend/hooks/entity/entity.store";
import { META_USER_PERMISSIONS } from "shared/types/user";
import { MutatePermission } from "../MutatePermission";

export const usePortalExtendedPermissions = () => {
  const activeEntities = useActiveEntities();

  const getEntitiesDictionPlurals = useEntityDictionPlurals(
    activeEntities.data || [],
    "value"
  );

  const entitiesAsPermissionList = [
    ...(activeEntities.data || []).map((entity) => ({
      value: META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(entity.value),
      label: getEntitiesDictionPlurals(entity.value),
    })),
  ];

  return [
    {
      label: "Entities",
      content: <MutatePermission permissionList={entitiesAsPermissionList} />,
    },
  ];
};
