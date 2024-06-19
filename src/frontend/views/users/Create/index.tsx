import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { UserPermissions } from "shared/constants/user";
import { AppLayout } from "frontend/_layouts/app";
import { ICreateUserForm } from "shared/form-schemas/users";
import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { msg } from "@lingui/macro";
import { useDomainMessages } from "frontend/lib/crud-config";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";
import { ContentLayout } from "@/components/app/content-layout";
import { SchemaForm } from "@/components/app/form/schema";
import { SectionBox } from "@/components/app/section-box";
import { useCreateUserMutation } from "../users.store";

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
  const domainMessages = useDomainMessages(LANG_DOMAINS.ACCOUNT.USERS);

  useSetPageDetails({
    pageTitle: domainMessages.TEXT_LANG.CREATE,
    viewKey: `create-users`,
    permission: UserPermissions.CAN_MANAGE_USERS,
  });

  return (
    <AppLayout>
      <ContentLayout.Center>
        <SectionBox title={domainMessages.TEXT_LANG.CREATE} backLink={backLink}>
          <SchemaForm<ICreateUserForm>
            onSubmit={userCreationMutation.mutateAsync}
            buttonText={domainMessages.FORM_LANG.CREATE}
            fields={CREATE_USER_FORM_SCHEMA}
            systemIcon="Plus"
            resetForm
          />
        </SectionBox>
      </ContentLayout.Center>
    </AppLayout>
  );
}
