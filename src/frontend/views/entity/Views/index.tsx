import { SectionBox } from "@/components/app/section-box";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "@/components/app/skeleton/form";
import { ViewStateMachine } from "@/components/app/view-state-machine";
import { useDocumentationActionButton } from "@/frontend/docs/constants";
import { ViewsDocumentation } from "@/frontend/docs/views";
import { useAppConfigurationDomainMessages } from "@/frontend/hooks/configuration/configuration.constant";
import {
  useEntityConfiguration,
  useUpsertConfigurationMutation,
} from "@/frontend/hooks/configuration/configuration.store";
import { useEntitySlug } from "@/frontend/hooks/entity/entity.config";
import { useSetPageDetails } from "@/frontend/lib/routing/usePageDetails";
import { useTableColumns } from "@/frontend/views/data/Table/useTableColumns";
import { UserPermissions } from "@/shared/constants/user";

import { BaseEntitySettingsLayout } from "../_Base";
import { ENTITY_CONFIGURATION_VIEW } from "../constants";
import { EntityTableTabForm } from "./Form";

export function TableViewsSettings() {
  const entity = useEntitySlug();
  const domainMessages = useAppConfigurationDomainMessages("table_views");

  const upsertTableViewsMutation = useUpsertConfigurationMutation(
    "table_views",
    entity
  );

  const documentationActionButton = useDocumentationActionButton(
    domainMessages.TEXT_LANG.TITLE
  );

  const tableViews = useEntityConfiguration("table_views", entity);

  const tableColumns = useTableColumns(entity);

  useSetPageDetails({
    pageTitle: domainMessages.TEXT_LANG.TITLE,
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: UserPermissions.CAN_CONFIGURE_APP,
  });

  const isLoading = tableColumns.isLoading || tableViews.isLoading;

  const error = tableViews.error || tableColumns.error;

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
              schema={[FormSkeletonSchema.Input, FormSkeletonSchema.Textarea]}
            />
          }
        >
          {!isLoading && (
            <EntityTableTabForm
              initialValues={tableViews.data}
              onSubmit={upsertTableViewsMutation.mutateAsync}
              tableColumns={tableColumns.data || []}
            />
          )}
        </ViewStateMachine>
      </SectionBox>
      <ViewsDocumentation />
    </BaseEntitySettingsLayout>
  );
}
