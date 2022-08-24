import {
  ErrorAlert,
  RenderList,
  SectionBox,
  SectionCenter,
  SectionListItem,
  Spacer,
  Text,
} from "@hadmean/chromista";
import { TitleLang } from "@hadmean/protozoa";
import { useEntitiesList } from "frontend/hooks/entity/entity.store";
import { createViewStateMachine } from "frontend/lib/create-view-state-machine";
import { useNavigationStack, useSetPageDetails } from "frontend/lib/routing";
import { userFriendlyCase } from "frontend/lib/strings";
import { USER_PERMISSIONS, META_USER_PERMISSIONS } from "shared/types";
import { AppLayout } from "../../../_layouts/app";
import { useRoleIdFromRouteParam } from "../hooks";
import {
  useRolePermissionDeletionMutation,
  useCreateRolePermissionMutation,
  useRolePermissions,
} from "../permissions.store";

export function RolePermissions() {
  const roleId = useRoleIdFromRouteParam();
  const rolePermissions = useRolePermissions(roleId);
  const entitiesList = useEntitiesList();

  const rolePermissionDeletionMutation = useRolePermissionDeletionMutation();
  const rolePermissionCreationMutation = useCreateRolePermissionMutation();

  const { canGoBack, goBack } = useNavigationStack();

  useSetPageDetails({
    pageTitle: "Role Permissions",
    viewKey: "ROLE_PERMISSION",
    permission: USER_PERMISSIONS.CAN_MANAGE_PERMISSIONS,
  });

  const isLoading = rolePermissions.isLoading || entitiesList.isLoading;

  const error = rolePermissions.error || entitiesList.isLoading;

  const viewStateMachine = createViewStateMachine(isLoading, error);

  const allList = [
    ...Object.values(USER_PERMISSIONS),
    ...(entitiesList.data || []).map((entity) =>
      META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(entity.value)
    ),
  ];

  // TODO need to show the real entity label here

  return (
    <AppLayout>
      <SectionCenter>
        <SectionBox
          title={TitleLang.edit("Role Permission")}
          backLink={
            canGoBack()
              ? {
                  action: goBack,
                  label: "Go Back",
                }
              : undefined
          }
        >
          {viewStateMachine.type === "error" && <ErrorAlert message={error} />}

          <Text size="5">
            LINK_TO_DOC some help text on the cruxes of permissions
          </Text>
          <Spacer size="xxl" />
          {allList.length > 0 && (
            <RenderList
              items={allList.map((listItem) => ({ name: listItem }))}
              singular="Entity"
              isLoading={isLoading}
              render={(menuItem) => {
                const isPermissionSelected = rolePermissions.data.includes(
                  menuItem.name
                );

                return (
                  <SectionListItem
                    label={userFriendlyCase(menuItem.name)}
                    key={menuItem.name}
                    toggle={{
                      selected: isPermissionSelected,
                      onChange: () => {
                        if (isPermissionSelected) {
                          rolePermissionDeletionMutation.mutate(menuItem.name);
                        } else {
                          rolePermissionCreationMutation.mutate(menuItem.name);
                        }
                      },
                    }}
                  />
                );
              }}
            />
          )}
        </SectionBox>
        <Spacer />
      </SectionCenter>
    </AppLayout>
  );
}
