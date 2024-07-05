import { AppLayout } from "frontend/_layouts/app";
import { useDomainMessages } from "frontend/lib/crud-config";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";
import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { UserPermissions } from "shared/constants/user";
import type { IBaseRoleForm } from "shared/form-schemas/roles/base";
import { BASE_ROLE_FORM_SCHEMA } from "shared/form-schemas/roles/base";

import { ContentLayout } from "@/components/app/content-layout";
import { SchemaForm } from "@/components/app/form/schema";
import { SectionBox } from "@/components/app/section-box";

import { useCreateRoleMutation } from "../roles.store";

export function RoleCreate() {
  const domainMessages = useDomainMessages(LANG_DOMAINS.ACCOUNT.ROLES);

  const roleCreationMutation = useCreateRoleMutation();
  const { backLink } = useNavigationStack();

  useSetPageDetails({
    pageTitle: domainMessages.TEXT_LANG.CREATE,
    viewKey: "add-new-role",
    permission: UserPermissions.CAN_MANAGE_PERMISSIONS,
  });

  return (
    <AppLayout>
      <ContentLayout.Center>
        <SectionBox title={domainMessages.TEXT_LANG.CREATE} backLink={backLink}>
          <SchemaForm<IBaseRoleForm>
            onSubmit={roleCreationMutation.mutateAsync}
            buttonText={domainMessages.FORM_LANG.CREATE}
            fields={BASE_ROLE_FORM_SCHEMA}
            systemIcon="Plus"
            resetForm
          />
        </SectionBox>
      </ContentLayout.Center>
    </AppLayout>
  );
}
