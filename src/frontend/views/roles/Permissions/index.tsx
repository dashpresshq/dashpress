import { useActiveEntities } from "frontend/hooks/entity/entity.store";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import {
  UserPermissions,
  USER_PERMISSIONS_CONFIG,
} from "shared/constants/user";
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
import { MessageDescriptor } from "@lingui/core";
import { typescriptSafeObjectDotEntries } from "shared/lib/objects";
import { useDomainMessages } from "frontend/lib/crud-config";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";
import { useRolePermissions } from "../permissions.store";
import { MutatePermission } from "./MutatePermission";
import {
  usePortalExtendedPermissions,
  usePortalUserPermissions,
} from "./Portal";

const mapPermissionStringToLabelValue = (
  permissions: Record<string, { label: MessageDescriptor }>
) => {
  return typescriptSafeObjectDotEntries(permissions).map(
    ([permission, config]) => ({
      value: permission,
      label: config.label,
    })
  );
};

// TODO: sort by heirachy
const adminPermissionList: { value: string; label: MessageDescriptor }[] =
  mapPermissionStringToLabelValue(USER_PERMISSIONS_CONFIG);

export function RolePermissions() {
  const activeEntities = useActiveEntities();
  const portalPermission = usePortalExtendedPermissions();
  const rolePermissions = useRolePermissions();
  const portalUserPermissions = usePortalUserPermissions();
  const { backLink } = useNavigationStack();
  const domainMessages = useDomainMessages(LANG_DOMAINS.ACCOUNT.PERMISSIONS);

  const tabFromUrl = useRouteParam("tab");
  const changeTabParam = useChangeRouterParam("tab");

  const documentationActionButton = useDocumentationActionButton(
    msg`Roles and Permissions`
  );

  useSetPageDetails({
    pageTitle: domainMessages.TEXT_LANG.TITLE,
    viewKey: `list-permissions`,
    permission: UserPermissions.CAN_MANAGE_PERMISSIONS,
  });

  const isLoading = rolePermissions.isLoading || activeEntities.isLoading;
  const error = rolePermissions.error || activeEntities.error;

  return (
    <AppLayout>
      <ContentLayout.Center>
        <SectionBox
          title={domainMessages.TEXT_LANG.EDIT}
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
                        ...portalUserPermissions,
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
