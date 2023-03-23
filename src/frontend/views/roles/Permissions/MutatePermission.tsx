import { RenderList, SectionListItem } from "@hadmean/chromista";
import { ILabelValue } from "types";
import {
  useCreateRolePermissionMutation,
  useRolePermissionDeletionMutation,
  useRolePermissions,
} from "../permissions.store";

interface IProps {
  permissionList: ILabelValue[];
}

export function MutatePermission({ permissionList }: IProps) {
  const rolePermissions = useRolePermissions();

  const rolePermissionDeletionMutation = useRolePermissionDeletionMutation();
  const rolePermissionCreationMutation = useCreateRolePermissionMutation();

  return (
    permissionList.length > 0 && (
      <RenderList
        sortByLabel
        items={permissionList.map(({ label, value }) => ({
          name: label,
          value,
        }))}
        render={(menuItem) => {
          const isPermissionSelected = (rolePermissions.data || []).includes(
            menuItem.value
          );

          return (
            <SectionListItem
              label={menuItem.name}
              key={menuItem.value}
              toggle={{
                selected: isPermissionSelected,
                onChange: () => {
                  if (isPermissionSelected) {
                    rolePermissionDeletionMutation.mutate([menuItem.value]);
                  } else {
                    rolePermissionCreationMutation.mutate([menuItem.value]);
                  }
                },
              }}
            />
          );
        }}
      />
    )
  );
}
