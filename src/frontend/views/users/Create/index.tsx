import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { USER_PERMISSIONS } from "shared/constants/user";
import { useState } from "react";
import { DOCUMENTATION_LABEL } from "frontend/docs";
import { SystemProfileDocumentation } from "frontend/docs/system-profile";
import { ContentLayout } from "frontend/design-system/components/Section/SectionDivider";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import { AppLayout } from "frontend/_layouts/app";
import { SchemaForm } from "frontend/components/SchemaForm";
import {
  CREATE_USER_FORM_SCHEMA,
  ICreateUserForm,
} from "shared/form-schemas/users/create";
import { ADMIN_USERS_CRUD_CONFIG, useCreateUserMutation } from "../users.store";

const DOCS_TITLE = "System Profile";

export function UserCreate() {
  const userCreationMutation = useCreateUserMutation();
  const { backLink } = useNavigationStack();
  const [isDocOpen, setIsDocOpen] = useState(false);

  useSetPageDetails({
    pageTitle: ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.CREATE,
    viewKey: ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.CREATE,
    permission: USER_PERMISSIONS.CAN_MANAGE_USERS,
  });

  return (
    <AppLayout>
      <ContentLayout.Center>
        <SectionBox
          title={ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.CREATE}
          backLink={backLink}
          actionButtons={[
            {
              _type: "normal",
              action: () => setIsDocOpen(true),
              icon: "help",
              label: DOCUMENTATION_LABEL.CONCEPT(DOCS_TITLE),
            },
          ]}
        >
          <SchemaForm<ICreateUserForm>
            onSubmit={userCreationMutation.mutateAsync}
            buttonText={ADMIN_USERS_CRUD_CONFIG.FORM_LANG.CREATE}
            fields={CREATE_USER_FORM_SCHEMA}
            icon="add"
            resetForm
          />
        </SectionBox>
      </ContentLayout.Center>
      <SystemProfileDocumentation
        title={DOCS_TITLE}
        close={setIsDocOpen}
        isOpen={isDocOpen}
      />
    </AppLayout>
  );
}
