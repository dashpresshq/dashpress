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
import { USER_PERMISSIONS } from "shared/constants/user";
import { useTableColumns } from "frontend/views/data/Table/useTableColumns";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { ViewsDocumentation } from "frontend/docs/views";
import { useDocumentationActionButton } from "frontend/docs/constants";
import { BaseEntitySettingsLayout } from "../_Base";
import { ENTITY_CONFIGURATION_VIEW } from "../constants";
import { EntityScopedQueriesForm } from "./Form";

const CRUD_CONFIG = MAKE_APP_CONFIGURATION_CRUD_CONFIG("persistent_query");

export function EntityPersistentQuerySettings() {
  const entity = useEntitySlug();

  const upsertPeristentQueryMutation = useUpsertConfigurationMutation(
    "persistent_query",
    entity
  );

  const documentationActionButton = useDocumentationActionButton(
    CRUD_CONFIG.TEXT_LANG.TITLE
  );

  const peristentQuery = useEntityConfiguration("persistent_query", entity);

  const tableColumns = useTableColumns(entity);

  useSetPageDetails({
    pageTitle: CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: ENTITY_CONFIGURATION_VIEW,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  const isLoading = tableColumns.isLoading || peristentQuery.isLoading;

  const error = peristentQuery.error || tableColumns.error;

  return (
    <BaseEntitySettingsLayout>
      <SectionBox
        title={CRUD_CONFIG.TEXT_LANG.TITLE}
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
            <EntityScopedQueriesForm
              initialValues={upsertPeristentQueryMutation.data}
              onSubmit={upsertPeristentQueryMutation.mutateAsync}
              tableColumns={tableColumns.data || []}
            />
          )}
        </ViewStateMachine>
      </SectionBox>
      <ViewsDocumentation />
    </BaseEntitySettingsLayout>
  );
}
