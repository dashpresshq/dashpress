import { ILabelValue } from "shared/types/options";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { Stack } from "frontend/design-system/primitives/Stack";
import { FormButton } from "frontend/design-system/components/Button/FormButton";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { RenderList } from "frontend/design-system/components/RenderList";
import { SectionListItem } from "frontend/design-system/components/Section/SectionList";
import {
  useCreateRolePermissionMutation,
  useRolePermissionDeletionMutation,
  useRolePermissions,
} from "../permissions.store";
import { USER_PERMISSIONS } from "shared/constants/user";
import { PORTAL_PERMISSION_HEIRACHIES } from "shared/logic/permissions/portal";

interface IProps {
  permissionList: ILabelValue[];
  overAchingPermission?: string;
  singular: string;
}

const PERMISSION_HEIRACHIES = {
  [USER_PERMISSIONS.CAN_MANAGE_USERS]: USER_PERMISSIONS.CAN_RESET_PASSWORD,
  [USER_PERMISSIONS.CAN_CONFIGURE_APP]:
    USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS,
  [USER_PERMISSIONS.CAN_MANAGE_ALL_ENTITIES]:
    USER_PERMISSIONS.CAN_CONFIGURE_APP,
  ...PORTAL_PERMISSION_HEIRACHIES,
};

export function MutatePermission({
  permissionList,
  singular,
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
          <Stack justify="space-between" align="flex-start">
            <FormButton
              isMakingRequest={false}
              icon={isOverAchingPermissionSelected ? "check" : "square"}
              size="sm"
              isInverse
              text={() => userFriendlyCase(overAchingPermission)}
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
      <RenderList
        sortByLabel
        items={permissionList.map(({ label, value }) => ({
          name: label,
          value,
        }))}
        singular={singular}
        render={(menuItem) => {
          const isPermissionSelected = rolePermissions.data.includes(
            menuItem.value
          );

          return (
            <SectionListItem
              label={menuItem.name}
              key={menuItem.value}
              disabled={isOverAchingPermissionSelected}
              subtle={isOverAchingPermissionSelected}
              toggle={
                isOverAchingPermissionSelected
                  ? undefined
                  : {
                      selected: isPermissionSelected,
                      onChange: () => {
                        if (isPermissionSelected) {
                          const permissionsToSend = [menuItem.value];
                          const permissionHeirachy = Object.entries<string>(
                            PERMISSION_HEIRACHIES
                          ).find(([index, _]) => index === menuItem.value);

                          if (permissionHeirachy) {
                            permissionsToSend.push(permissionHeirachy[1]);
                          }
                          rolePermissionDeletionMutation.mutate(
                            permissionsToSend
                          );
                        } else {
                          const permissionsToSend = [menuItem.value];

                          const permissionHeirachy = Object.entries(
                            PERMISSION_HEIRACHIES
                          ).find(([_, value]) => value === menuItem.value);

                          if (permissionHeirachy) {
                            permissionsToSend.push(permissionHeirachy[0]);
                          }

                          rolePermissionCreationMutation.mutate(
                            permissionsToSend
                          );
                        }
                      },
                    }
              }
            />
          );
        }}
      />
    </>
  );
}
