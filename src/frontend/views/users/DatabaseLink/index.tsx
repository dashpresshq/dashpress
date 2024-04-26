import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { USER_PERMISSIONS } from "shared/constants/user";
import { ContentLayout } from "frontend/design-system/components/Section/SectionDivider";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import { AppLayout } from "frontend/_layouts/app";
import { SchemaForm } from "frontend/components/SchemaForm";
import { useDocumentationActionButton } from "frontend/docs/constants";
import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { ACTIVE_ENTITIES_ENDPOINT } from "shared/constants/entities";
import {
  useAppConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "frontend/design-system/components/Skeleton/Form";
import { MAKE_CRUD_CONFIG } from "frontend/lib/crud-config";
import { UsersLinkToDatabaseDocumentation } from "frontend/docs/users-link-to-database";
import { useEntityFieldLists } from "frontend/hooks/entity/entity.store";
import { useEffect, useState } from "react";
import { msg } from "@lingui/macro";

type IUsersLinkToDatabaseForm = {
  table: string;
  field: string;
};

const CRUD_CONFIG = MAKE_CRUD_CONFIG({
  plural: msg`Users Link To Database`,
  singular: msg`Users Link To Database`,
});

export function UsersLinkToDatabase() {
  const { backLink } = useNavigationStack();

  const documentationActionButton = useDocumentationActionButton(
    CRUD_CONFIG.TEXT_LANG.TITLE
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
          label: field,
          value: field,
        })),
        validations: [
          {
            validationType: "required",
          },
        ],
      },
    };

  useSetPageDetails({
    pageTitle: CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: CRUD_CONFIG.TEXT_LANG.TITLE.message,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  return (
    <AppLayout actionItems={[documentationActionButton]}>
      <ContentLayout.Center>
        <SectionBox title={CRUD_CONFIG.TEXT_LANG.TITLE} backLink={backLink}>
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
              buttonText={CRUD_CONFIG.FORM_LANG.UPSERT}
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
