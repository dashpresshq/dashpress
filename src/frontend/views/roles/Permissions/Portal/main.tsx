import { msg } from "@lingui/macro";
import { BaseMutateEntitiesPermissions } from "./fallback";

export const usePortalExtendedPermissions = () => {
  return [
    {
      label: msg`Entities`,
      id: `entities`,
      content: <BaseMutateEntitiesPermissions />,
    },
  ];
};

export const usePortalUserPermissions = () => {
  return {};
};
