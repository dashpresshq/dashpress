import { Stack } from "frontend/design-system/primitives/Stack";
import { FormButton } from "frontend/design-system/components/Button/FormButton";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { ListManager } from "frontend/design-system/components/ListManager";
import {
  USER_PERMISSIONS_CONFIG,
  UserPermissions,
} from "shared/constants/user";
import { PORTAL_PERMISSION_HEIRACHIES } from "shared/logic/permissions/portal";
import { loadedDataState } from "frontend/lib/data/constants/loadedDataState";
import { IListMangerItemProps } from "frontend/design-system/components/ListManager/ListManagerItem";
import { msg } from "@lingui/macro";
import { MessageDescriptor } from "@lingui/core";
import { useLingui } from "@lingui/react";
import {
  useCreateRolePermissionMutation,
  useDeleteRolePermissionMutation,
  useRolePermissions,
} from "../permissions.store";

interface IProps {
  permissionList: { value: string; label: MessageDescriptor }[];
  overAchingPermission?: UserPermissions;
}

/*
  IMPORTANT NOTE:
  LESSER PERMISSION FIRST
*/
const PERMISSION_HEIRACHIES: [string, string][] = [
  [UserPermissions.CAN_MANAGE_USERS, UserPermissions.CAN_RESET_PASSWORD],
  [
    UserPermissions.CAN_CONFIGURE_APP,
    UserPermissions.CAN_MANAGE_APP_CREDENTIALS,
  ],
  [UserPermissions.CAN_MANAGE_ALL_ENTITIES, UserPermissions.CAN_CONFIGURE_APP],
  ...PORTAL_PERMISSION_HEIRACHIES,
];

export const getPermissionChildren = (
  permission: string,
  mainKey: 1 | 0,
  permissions: string[] = []
): string[] => {
  permissions.push(permission);

  const permissionHeirachies = PERMISSION_HEIRACHIES.filter(
    (value) => value[mainKey === 1 ? 0 : 1] === permission
  );

  permissionHeirachies.forEach((permissionHeirachy) => {
    getPermissionChildren(permissionHeirachy[mainKey], mainKey, permissions);
  });

  return permissions;
};

export function MutatePermission({
  permissionList,
  overAchingPermission,
}: IProps) {
  const { _ } = useLingui();
  const rolePermissions = useRolePermissions();

  const rolePermissionDeletionMutation = useDeleteRolePermissionMutation();
  const rolePermissionCreationMutation = useCreateRolePermissionMutation();

  const isOverAchingPermissionSelected =
    overAchingPermission && rolePermissions.data.includes(overAchingPermission);

  return (
    <>
      {overAchingPermission && (
        <>
          <Stack $justify="space-between" $align="flex-start">
            <FormButton
              isMakingRequest={false}
              systemIcon={isOverAchingPermissionSelected ? "Check" : "Square"}
              size="sm"
              isInverse
              text={() => USER_PERMISSIONS_CONFIG[overAchingPermission].label}
              onClick={() => {
                if (isOverAchingPermissionSelected) {
                  rolePermissionDeletionMutation.mutate([overAchingPermission]);
                } else {
                  rolePermissionCreationMutation.mutate([overAchingPermission]);
                }
              }}
            />
          </Stack>

          <Spacer size="xxl" />
        </>
      )}
      <ListManager
        items={loadedDataState(
          permissionList.map((permission) => ({
            ...permission,
            label: _(permission.label),
          }))
        )}
        listLengthGuess={10}
        labelField="label"
        empty={{
          text: msg`No available permission for this section`,
        }}
        render={(menuItem) => {
          const isPermissionSelected = rolePermissions.data.includes(
            menuItem.value
          );

          const props: IListMangerItemProps = {
            label: menuItem.label,
            disabled: isOverAchingPermissionSelected,
            subtle: isOverAchingPermissionSelected,
            toggle: isOverAchingPermissionSelected
              ? undefined
              : {
                  selected: isPermissionSelected,
                  onChange: () => {
                    if (isPermissionSelected) {
                      rolePermissionDeletionMutation.mutate(
                        getPermissionChildren(menuItem.value, 1)
                      );
                    } else {
                      rolePermissionCreationMutation.mutate(
                        getPermissionChildren(menuItem.value, 0)
                      );
                    }
                  },
                },
          };

          return props;
        }}
      />
    </>
  );
}
