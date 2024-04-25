import { ILabelValue } from "shared/types/options";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { Stack } from "frontend/design-system/primitives/Stack";
import { FormButton } from "frontend/design-system/components/Button/FormButton";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { ListManager } from "frontend/design-system/components/ListManager";
import { USER_PERMISSIONS } from "shared/constants/user";
import { PORTAL_PERMISSION_HEIRACHIES } from "shared/logic/permissions/portal";
import { loadedDataState } from "frontend/lib/data/constants/loadedDataState";
import { IListMangerItemProps } from "frontend/design-system/components/ListManager/ListManagerItem";
import { msg } from "@lingui/macro";
import {
  useCreateRolePermissionMutation,
  useRolePermissionDeletionMutation,
  useRolePermissions,
} from "../permissions.store";

interface IProps {
  permissionList: ILabelValue[];
  overAchingPermission?: string;
}

/*
  IMPORTANT NOTE:
  LESSER PERMISSION FIRST
*/
const PERMISSION_HEIRACHIES: [string, string][] = [
  [USER_PERMISSIONS.CAN_MANAGE_USERS, USER_PERMISSIONS.CAN_RESET_PASSWORD],
  [
    USER_PERMISSIONS.CAN_CONFIGURE_APP,
    USER_PERMISSIONS.CAN_MANAGE_APP_CREDENTIALS,
  ],
  [
    USER_PERMISSIONS.CAN_MANAGE_ALL_ENTITIES,
    USER_PERMISSIONS.CAN_CONFIGURE_APP,
  ],
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
  const rolePermissions = useRolePermissions();

  const rolePermissionDeletionMutation = useRolePermissionDeletionMutation();
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
              text={() => msg`${userFriendlyCase(overAchingPermission)}`}
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
        items={loadedDataState(permissionList)}
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
