import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/macro";

import { ContentLayout } from "@/components/app/content-layout";
import { SectionBox } from "@/components/app/section-box";
import { ListSkeleton } from "@/components/app/skeleton/list";
import { Tabs } from "@/components/app/tabs";
import { ViewStateMachine } from "@/components/app/view-state-machine";
import { AppLayout } from "@/frontend/_layouts/app";
import { useDocumentationActionButton } from "@/frontend/docs/constants";
import { RolesDocumentation } from "@/frontend/docs/roles";
import { useActiveEntities } from "@/frontend/hooks/entity/entity.store";
import { useDomainMessages } from "@/frontend/lib/crud-config";
import { LANG_DOMAINS } from "@/frontend/lib/crud-config/lang-domains";
import { useChangeRouterParam } from "@/frontend/lib/routing/useChangeRouterParam";
import { useNavigationStack } from "@/frontend/lib/routing/useNavigationStack";
import { useSetPageDetails } from "@/frontend/lib/routing/usePageDetails";
import { useRouteParam } from "@/frontend/lib/routing/useRouteParam";
import {
  USER_PERMISSIONS_CONFIG,
  UserPermissions,
} from "@/shared/constants/user";
import { typescriptSafeObjectDotEntries } from "@/shared/lib/objects";

import { useRolePermissions } from "../permissions.store";
import { MutatePermission } from "./MutatePermission";
import {
  usePortalExtendedPermissions,
  usePortalUserPermissions,
} from "./Portal";

const mapPermissionStringToLabelValue = (
  permissions: Record<string, { label: MessageDescriptor; order: number }>
) => {
  return typescriptSafeObjectDotEntries(permissions).map(
    ([permission, config]) => ({
      value: permission,
      ...config,
    })
  );
};

const adminPermissionList: {
  value: string;
  label: MessageDescriptor;
  order: number;
}[] = mapPermissionStringToLabelValue(USER_PERMISSIONS_CONFIG);

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
    LANG_DOMAINS.ACCOUNT.PERMISSIONS.plural
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
                      ].sort((a, b) => b.order - a.order)}
                    />
                  ),
                },
                ...portalPermission,
              ]}
            />
          </ViewStateMachine>
        </SectionBox>
      </ContentLayout.Center>
      <RolesDocumentation />
    </AppLayout>
  );
}
