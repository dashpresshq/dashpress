import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "frontend/design-system/components/Skeleton/Form";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { useEntitySlug } from "frontend/hooks/entity/entity.config";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "frontend/hooks/configuration/configuration.store";
import { UserPermissions } from "shared/constants/user";
import { useTableColumns } from "frontend/views/data/Table/useTableColumns";
import { useDocumentationActionButton } from "frontend/docs/constants";
import { PersistentDocumentation } from "frontend/docs/persistent-query";
import { useAppConfigurationDomainMessages } from "frontend/hooks/configuration/configuration.constant";
import { BaseEntitySettingsLayout } from "../_Base";
import { ENTITY_CONFIGURATION_VIEW } from "../constants";
import { EntityPersistentQueryForm } from "./Form";

export function EntityPersistentQuerySettings() {
  const entity = useEntitySlug();
  const domainMessages = useAppConfigurationDomainMessages("persistent_query");

  const upsertPeristentQueryMutation = useUpsertConfigurationMutation(
    "persistent_query",
    entity
  );

  const documentationActionButton = useDocumentationActionButton(
    domainMessages.TEXT_LANG.TITLE
  );

  const peristentQuery = useEntityConfiguration("persistent_query", entity);

  const tableColumns = useTableColumns(entity);

  useSetPageDetails({
    pageTitle: domainMessages.TEXT_LANG.TITLE,
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: UserPermissions.CAN_CONFIGURE_APP,
  });

  const isLoading = tableColumns.isLoading || peristentQuery.isLoading;

  const error = peristentQuery.error || tableColumns.error;

  return (
    <BaseEntitySettingsLayout>
      <SectionBox
        title={domainMessages.TEXT_LANG.TITLE}
        actionButtons={[documentationActionButton]}
      >
        <ViewStateMachine
          loading={isLoading}
          error={error}
          loader={
            <FormSkeleton
              schema={[FormSkeletonSchema.Input, FormSkeletonSchema.Input]}
            />
          }
        >
          <EntityPersistentQueryForm
            initialValues={peristentQuery.data}
            onSubmit={upsertPeristentQueryMutation.mutateAsync}
            tableColumns={tableColumns.data || []}
          />
        </ViewStateMachine>
      </SectionBox>
      <PersistentDocumentation />
    </BaseEntitySettingsLayout>
  );
}
