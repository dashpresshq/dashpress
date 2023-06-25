import { SectionBox, ContentLayout } from "@hadmean/chromista";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { USER_PERMISSIONS } from "shared/constants/user";
import { AppLayout } from "../../../_layouts/app";
import { ADMIN_ROLES_CRUD_CONFIG, useCreateRoleMutation } from "../roles.store";
import { CreateRoleForm } from "./Form";

export function RoleCreate() {
  const roleCreationMutation = useCreateRoleMutation();
  const { backLink } = useNavigationStack();

  useSetPageDetails({
    pageTitle: ADMIN_ROLES_CRUD_CONFIG.TEXT_LANG.CREATE,
    viewKey: ADMIN_ROLES_CRUD_CONFIG.TEXT_LANG.CREATE,
    permission: USER_PERMISSIONS.CAN_MANAGE_PERMISSIONS,
  });

  return (
    <AppLayout>
      <ContentLayout.Center>
        <SectionBox
          title={ADMIN_ROLES_CRUD_CONFIG.TEXT_LANG.CREATE}
          backLink={backLink}
        >
          <CreateRoleForm
            onSubmit={async (role) => {
              await roleCreationMutation.mutateAsync(role);
            }}
          />
        </SectionBox>
      </ContentLayout.Center>
    </AppLayout>
  );
}
