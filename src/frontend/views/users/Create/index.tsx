import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { USER_PERMISSIONS } from "shared/constants/user";
import { ContentLayout } from "frontend/design-system/components/Section/SectionDivider";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import { AppLayout } from "frontend/_layouts/app";
import { SchemaForm } from "frontend/components/SchemaForm";
import { ICreateUserForm } from "shared/form-schemas/users";
import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { msg } from "@lingui/macro";
import { ADMIN_USERS_CRUD_CONFIG, useCreateUserMutation } from "../users.store";

export const CREATE_USER_FORM_SCHEMA: IAppliedSchemaFormConfig<ICreateUserForm> =
  {
    username: {
      type: "text",
      label: msg`Username`,
      validations: [
        {
          validationType: "required",
        },
        {
          validationType: "alphanumeric",
        },
      ],
    },
    name: {
      type: "text",
      label: msg`Name`,
      validations: [
        {
          validationType: "required",
        },
      ],
    },
    password: {
      label: msg`Password`,
      type: "password",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
    role: {
      label: msg`Role`,
      type: "selection",
      apiSelections: {
        listUrl: "/api/roles",
      },
      validations: [
        {
          validationType: "required",
        },
      ],
    },
  };

export function UserCreate() {
  const userCreationMutation = useCreateUserMutation();
  const { backLink } = useNavigationStack();

  useSetPageDetails({
    pageTitle: ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.CREATE,
    viewKey: `create-users`,
    permission: USER_PERMISSIONS.CAN_MANAGE_USERS,
  });

  return (
    <AppLayout>
      <ContentLayout.Center>
        <SectionBox
          title={ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.CREATE}
          backLink={backLink}
        >
          <SchemaForm<ICreateUserForm>
            onSubmit={userCreationMutation.mutateAsync}
            buttonText={ADMIN_USERS_CRUD_CONFIG.FORM_LANG.CREATE}
            fields={CREATE_USER_FORM_SCHEMA}
            systemIcon="Plus"
            resetForm
          />
        </SectionBox>
      </ContentLayout.Center>
    </AppLayout>
  );
}
