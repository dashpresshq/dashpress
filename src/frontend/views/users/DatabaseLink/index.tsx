import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { UserPermissions } from "shared/constants/user";
import { AppLayout } from "frontend/_layouts/app";
import { useDocumentationActionButton } from "frontend/docs/constants";
import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { ACTIVE_ENTITIES_ENDPOINT } from "shared/constants/entities";
import {
  useAppConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { UsersLinkToDatabaseDocumentation } from "frontend/docs/users-link-to-database";
import { useEntityFieldLists } from "frontend/hooks/entity/entity.store";
import { useEffect, useState } from "react";
import { msg } from "@lingui/macro";
import { fakeMessageDescriptor } from "translations/fake";
import { useDomainMessages } from "frontend/lib/crud-config";
import { ContentLayout } from "@/components/app/content-layout";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "@/components/app/skeleton/form";
import { ViewStateMachine } from "@/components/app/view-state-machine";
import { SchemaForm } from "@/components/app/form/schema";
import { SectionBox } from "@/components/app/section-box";

type IUsersLinkToDatabaseForm = {
  table: string;
  field: string;
};

export function UsersLinkToDatabase() {
  const domainMessages = useDomainMessages({
    plural: msg`Users Link To Database`,
    singular: msg`Users Link To Database`,
  });
  const { backLink } = useNavigationStack();

  const documentationActionButton = useDocumentationActionButton(
    domainMessages.TEXT_LANG.TITLE
  );
  const [entity, setEntity] = useState("");

  const userToDatabaseLink = useAppConfiguration("users_to_database_link");
  const upsertConfigurationMutation = useUpsertConfigurationMutation(
    "users_to_database_link"
  );

  useEffect(() => {
    if (userToDatabaseLink.data) {
      setEntity(userToDatabaseLink.data.table);
    }
  }, [userToDatabaseLink.data]);

  const entityFields = useEntityFieldLists(entity);

  const LINK_USERS_TO_DATABASE_FORM_SCHEMA: IAppliedSchemaFormConfig<IUsersLinkToDatabaseForm> =
    {
      table: {
        type: "selection",
        label: msg`Your Users Table`,
        apiSelections: {
          listUrl: ACTIVE_ENTITIES_ENDPOINT,
        },
        validations: [
          {
            validationType: "required",
          },
        ],
        onChange: setEntity,
      },
      field: {
        type: "selection",
        label: msg`Field Corresponding To Dashpress Usernames`,
        selections: entityFields.data.map((field) => ({
          value: field,
          label: fakeMessageDescriptor(field),
        })),
        validations: [
          {
            validationType: "required",
          },
        ],
      },
    };

  useSetPageDetails({
    pageTitle: domainMessages.TEXT_LANG.TITLE,
    viewKey: domainMessages.TEXT_LANG.TITLE.message,
    permission: UserPermissions.CAN_CONFIGURE_APP,
  });

  return (
    <AppLayout actionItems={[documentationActionButton]}>
      <ContentLayout.Center>
        <SectionBox title={domainMessages.TEXT_LANG.TITLE} backLink={backLink}>
          <ViewStateMachine
            loading={userToDatabaseLink.isLoading}
            error={userToDatabaseLink.error}
            loader={
              <FormSkeleton
                schema={[FormSkeletonSchema.Input, FormSkeletonSchema.Input]}
              />
            }
          >
            <SchemaForm<IUsersLinkToDatabaseForm>
              onSubmit={upsertConfigurationMutation.mutateAsync}
              buttonText={domainMessages.FORM_LANG.UPSERT}
              initialValues={userToDatabaseLink.data}
              fields={LINK_USERS_TO_DATABASE_FORM_SCHEMA}
              systemIcon="Save"
            />
          </ViewStateMachine>
        </SectionBox>
      </ContentLayout.Center>
      <UsersLinkToDatabaseDocumentation />
    </AppLayout>
  );
}
