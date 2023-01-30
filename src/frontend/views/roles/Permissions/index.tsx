import {
  ListSkeleton,
  SectionBox,
  SectionCenter,
  Spacer,
  Tabs,
} from "@hadmean/chromista";
import { TitleLang } from "@hadmean/protozoa";
import { useEntitiesList } from "frontend/hooks/entity/entity.store";
import { useNavigationStack, useSetPageDetails } from "frontend/lib/routing";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { LINK_TO_DOCS } from "frontend/views/constants";
import { USER_PERMISSIONS } from "shared/types/user";
import { useMemo } from "react";
import { ILabelValue } from "types";
import { userFriendlyCase } from "frontend/lib/strings";
import { AppLayout } from "../../../_layouts/app";
import { useRolePermissions } from "../permissions.store";
import { MutatePermission } from "./MutatePermission";
import { usePortalExtendedPermissions } from "./Portal";

export function RolePermissions() {
  const entitiesList = useEntitiesList();
  const portalPermission = usePortalExtendedPermissions();
  const rolePermissions = useRolePermissions();

  const { backLink } = useNavigationStack();

  useSetPageDetails({
    pageTitle: "Role Permissions",
    viewKey: "ROLE_PERMISSION",
    permission: USER_PERMISSIONS.CAN_MANAGE_PERMISSIONS,
  });

  const adminPermissionList: ILabelValue[] = useMemo(
    () =>
      Object.values(USER_PERMISSIONS).map((permission) => ({
        value: permission,
        label: userFriendlyCase(permission),
      })),
    []
  );

  const isLoading = rolePermissions.isLoading || entitiesList.isLoading;
  const error = rolePermissions.error || entitiesList.error;

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
            loader={<ListSkeleton count={20} />}
          >
            <Tabs
              contents={[
                {
                  label: "Admin",
                  content: (
                    <MutatePermission permissionList={adminPermissionList} />
                  ),
                },
                ...portalPermission,
              ]}
            />
          </ViewStateMachine>
        </SectionBox>
        <Spacer />
      </SectionCenter>
    </AppLayout>
  );
}
