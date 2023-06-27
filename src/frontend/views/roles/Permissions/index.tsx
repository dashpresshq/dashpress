import { useActiveEntities } from "frontend/hooks/entity/entity.store";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { BASE_USER_PERMISSIONS, USER_PERMISSIONS } from "shared/constants/user";
import { ILabelValue } from "shared/types/options";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { usePortalUserPermissions } from "shared/constants/portal/user";
import { DOCUMENTATION_LABEL } from "frontend/docs";
import { useState } from "react";
import { RolesDocumentation } from "frontend/docs/roles";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import { ContentLayout } from "frontend/design-system/components/Section/SectionDivider";
import { ListSkeleton } from "frontend/design-system/components/Skeleton/List";
import { Tabs } from "frontend/design-system/components/Tabs";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { AppLayout } from "frontend/_layouts/app";
import {
  ADMIN_PERMISSIONS_CRUD_CONFIG,
  useRolePermissions,
} from "../permissions.store";
import { MutatePermission } from "./MutatePermission";
import { usePortalExtendedPermissions } from "./Portal";

const mapPermissionStringToLabelValue = (permissionStringList: string[]) => {
  return permissionStringList.map((permission) => ({
    value: permission,
    label: userFriendlyCase(permission),
  }));
};

const adminPermissionList: ILabelValue[] = mapPermissionStringToLabelValue(
  Object.values(BASE_USER_PERMISSIONS)
);

const DOCS_TITLE = "Roles and Permissions";

export function RolePermissions() {
  const activeEntities = useActiveEntities();
  const portalPermission = usePortalExtendedPermissions();
  const rolePermissions = useRolePermissions();
  const portalUserPermissions = usePortalUserPermissions();
  const { backLink } = useNavigationStack();
  const [isDocOpen, setIsDocOpen] = useState(false);

  const portalUserPermissionsList = mapPermissionStringToLabelValue(
    portalUserPermissions
  );

  useSetPageDetails({
    pageTitle: ADMIN_PERMISSIONS_CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: ADMIN_PERMISSIONS_CRUD_CONFIG.TEXT_LANG.TITLE,
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
          iconButtons={[
            {
              action: () => setIsDocOpen(true),
              icon: "help",
              label: DOCUMENTATION_LABEL.CONCEPT(DOCS_TITLE),
            },
          ]}
        >
          <ViewStateMachine
            error={error}
            loading={isLoading}
            loader={<ListSkeleton count={20} />}
          >
            <Tabs
              contents={[
                {
                  label: "App",
                  content: (
                    <MutatePermission
                      singular="Invalid"
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
      <RolesDocumentation
        title={DOCS_TITLE}
        close={setIsDocOpen}
        isOpen={isDocOpen}
      />
    </AppLayout>
  );
}
