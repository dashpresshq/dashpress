import { useActiveEntities } from "frontend/hooks/entity/entity.store";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { BASE_USER_PERMISSIONS, USER_PERMISSIONS } from "shared/constants/user";
import { ILabelValue } from "shared/types/options";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { RolesDocumentation } from "frontend/docs/roles";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import { ContentLayout } from "frontend/design-system/components/Section/SectionDivider";
import { ListSkeleton } from "frontend/design-system/components/Skeleton/List";
import { Tabs } from "frontend/design-system/components/Tabs";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { AppLayout } from "frontend/_layouts/app";
import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import { useChangeRouterParam } from "frontend/lib/routing/useChangeRouterParam";
import { useDocumentationActionButton } from "frontend/docs/constants";
import { msg } from "@lingui/macro";
import {
  ADMIN_PERMISSIONS_CRUD_CONFIG,
  useRolePermissions,
} from "../permissions.store";
import { MutatePermission } from "./MutatePermission";
import {
  usePortalExtendedPermissions,
  usePortalUserPermissions,
} from "./Portal";

const mapPermissionStringToLabelValue = (permissionStringList: string[]) => {
  return permissionStringList.map((permission) => ({
    value: permission,
    label: userFriendlyCase(permission),
  }));
};

// TODO: sort by heirachy
const adminPermissionList: ILabelValue[] = mapPermissionStringToLabelValue(
  Object.values(BASE_USER_PERMISSIONS)
);

export function RolePermissions() {
  const activeEntities = useActiveEntities();
  const portalPermission = usePortalExtendedPermissions();
  const rolePermissions = useRolePermissions();
  const portalUserPermissions = usePortalUserPermissions();
  const { backLink } = useNavigationStack();

  const tabFromUrl = useRouteParam("tab");
  const changeTabParam = useChangeRouterParam("tab");

  const portalUserPermissionsList = mapPermissionStringToLabelValue(
    portalUserPermissions
  );

  const documentationActionButton = useDocumentationActionButton(
    msg`Roles and Permissions`
  );

  useSetPageDetails({
    pageTitle: ADMIN_PERMISSIONS_CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: `list-permissions`,
    permission: USER_PERMISSIONS.CAN_MANAGE_PERMISSIONS,
  });

  const isLoading = rolePermissions.isLoading || activeEntities.isLoading;
  const error = rolePermissions.error || activeEntities.error;

  return (
    <AppLayout>
      <ContentLayout.Center>
        <SectionBox
          title={ADMIN_PERMISSIONS_CRUD_CONFIG.TEXT_LANG.EDIT}
          backLink={backLink}
          actionButtons={[documentationActionButton]}
        >
          <ViewStateMachine
            error={error}
            loading={isLoading}
            loader={<ListSkeleton count={20} />}
          >
            <Tabs
              currentTab={tabFromUrl}
              onChange={changeTabParam}
              contents={[
                {
                  label: msg`App`,
                  id: "app",
                  content: (
                    <MutatePermission
                      permissionList={[
                        ...adminPermissionList,
                        ...portalUserPermissionsList,
                      ]}
                    />
                  ),
                },
                ...portalPermission,
              ]}
            />
          </ViewStateMachine>
        </SectionBox>
        <Spacer />
      </ContentLayout.Center>
      <RolesDocumentation />
    </AppLayout>
  );
}
