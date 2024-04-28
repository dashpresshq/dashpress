import { ContentLayout } from "frontend/design-system/components/Section/SectionDivider";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { UserPermissions } from "shared/constants/user";
import { AppLayout } from "frontend/_layouts/app";
import {
  BASE_ROLE_FORM_SCHEMA,
  IBaseRoleForm,
} from "shared/form-schemas/roles/base";
import { SchemaForm } from "frontend/components/SchemaForm";
import { ADMIN_ROLES_CRUD_CONFIG, useCreateRoleMutation } from "../roles.store";

export function RoleCreate() {
  const roleCreationMutation = useCreateRoleMutation();
  const { backLink } = useNavigationStack();

  useSetPageDetails({
    pageTitle: ADMIN_ROLES_CRUD_CONFIG.TEXT_LANG.CREATE,
    viewKey: "add-new-role",
    permission: UserPermissions.CAN_MANAGE_PERMISSIONS,
  });

  return (
    <AppLayout>
      <ContentLayout.Center>
        <SectionBox
          title={ADMIN_ROLES_CRUD_CONFIG.TEXT_LANG.CREATE}
          backLink={backLink}
        >
          <SchemaForm<IBaseRoleForm>
            onSubmit={roleCreationMutation.mutateAsync}
            buttonText={ADMIN_ROLES_CRUD_CONFIG.FORM_LANG.CREATE}
            fields={BASE_ROLE_FORM_SCHEMA}
            systemIcon="Plus"
            resetForm
          />
        </SectionBox>
      </ContentLayout.Center>
    </AppLayout>
  );
}
