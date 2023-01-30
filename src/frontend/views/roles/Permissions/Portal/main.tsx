import { useEntityDictionPlurals } from "frontend/hooks/entity/entity.queries";
import { useEntitiesList } from "frontend/hooks/entity/entity.store";
import { META_USER_PERMISSIONS } from "shared/types/user";
import { MutatePermission } from "../MutatePermission";

export const usePortalExtendedPermissions = () => {
  const entitiesList = useEntitiesList();

  const getEntitiesDictionPlurals = useEntityDictionPlurals(
    entitiesList.data || [],
    "value"
  );

  const entitiesAsPermissionList = [
    ...(entitiesList.data || []).map((entity) => ({
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
