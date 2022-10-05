import {
  ListSkeleton,
  RenderList,
  SectionBox,
  SectionCenter,
  SectionListItem,
  Spacer,
} from "@hadmean/chromista";
import { TitleLang } from "@hadmean/protozoa";
import { useEntitiesList } from "frontend/hooks/entity/entity.store";
import { useNavigationStack, useSetPageDetails } from "frontend/lib/routing";
import { userFriendlyCase } from "frontend/lib/strings";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import { LINK_TO_DOCS } from "frontend/views/constants";
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

  const { backLink } = useNavigationStack();

  useSetPageDetails({
    pageTitle: "Role Permissions",
    viewKey: "ROLE_PERMISSION",
    permission: USER_PERMISSIONS.CAN_MANAGE_PERMISSIONS,
  });

  const isLoading = rolePermissions.isLoading || entitiesList.isLoading;

  const error = rolePermissions.error || entitiesList.error;

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
          backLink={backLink}
          iconButtons={[
            {
              action: LINK_TO_DOCS("accounts/roles"),
              icon: "help",
              label: "Permissions Documentation",
            },
          ]}
        >
          <ViewStateMachine
            error={error}
            loading={isLoading}
            loader={<ListSkeleton />}
          >
            <>
              <Spacer size="xxl" />
              {allList.length > 0 && (
                <RenderList
                  items={allList.map((listItem) => ({ name: listItem }))}
                  singular="Entity"
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
                              rolePermissionDeletionMutation.mutate(
                                menuItem.name
                              );
                            } else {
                              rolePermissionCreationMutation.mutate(
                                menuItem.name
                              );
                            }
                          },
                        }}
                      />
                    );
                  }}
                />
              )}
            </>
          </ViewStateMachine>
        </SectionBox>
        <Spacer />
      </SectionCenter>
    </AppLayout>
  );
}
