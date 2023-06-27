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

interface IProps {
  permissionList: ILabelValue[];
  overAchingPermission?: string;
  singular: string;
}

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
                          rolePermissionDeletionMutation.mutate([
                            menuItem.value,
                          ]);
                        } else {
                          rolePermissionCreationMutation.mutate([
                            menuItem.value,
                          ]);
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
