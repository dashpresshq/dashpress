import {
  ErrorAlert,
  RenderList,
  SectionBox,
  SectionCenter,
  SectionListItem,
  Spacer,
  Text,
} from "@gothicgeeks/design-system";
import { TitleLang } from "@gothicgeeks/shared";
import { useEntitiesList } from "frontend/hooks/entity/entity.store";
import { createViewStateMachine } from "frontend/lib/create-view-state-machine";
import { useNavigationStack, useSetPageTitle } from "frontend/lib/routing";
import { userFriendlyCase } from "frontend/lib/strings";
import { APPLIED_CAN_ACCESS_ENTITY, USER_PERMISSIONS } from "shared/types";
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

  useSetPageTitle(`Role Permissions`, "ROLE_PERMISSION");

  const isLoading = rolePermissions.isLoading || entitiesList.isLoading;

  const error = rolePermissions.error || entitiesList.isLoading;

  const viewStateMachine = createViewStateMachine(isLoading, error);

  const allList = [
    ...Object.values(USER_PERMISSIONS),
    ...(entitiesList.data || []).map((entity) =>
      APPLIED_CAN_ACCESS_ENTITY(entity.value)
    ),
  ];

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

          <Text size="5">Edit the roles to your satisfcafton</Text>
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
                    actionButtons={[
                      {
                        isInverse: isPermissionSelected,
                        text: isPermissionSelected ? "Add" : "Drop",
                        onClick: () => {
                          if (isPermissionSelected) {
                            rolePermissionDeletionMutation.mutate(
                              menuItem.name
                            );
                          } else {
                            rolePermissionCreationMutation.mutate(
                              menuItem.name
                            );
                          }
                        },
                        isMakingRequest: false,
                      },
                    ]}
                    toNoWhere
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
