import { BaseMutateEntitiesPermissions } from "./fallback";

export const usePortalExtendedPermissions = () => {
  return [
    {
      label: "Entities",
      content: <BaseMutateEntitiesPermissions />,
    },
  ];
};

export const usePortalUserPermissions = () => {
  return [];
};
